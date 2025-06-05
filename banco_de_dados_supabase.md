# Tabela user_profiles

create table public.user_profiles (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid not null,
  nome character varying(100) not null,
  sobrenome character varying(100) not null,
  telefone character varying(20) null,
  role public.user_role not null default 'customer'::user_role,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  avatar_url text null,
  email character varying(255) null,
  constraint user_profiles_pkey primary key (id),
  constraint user_profiles_email_key unique (email),
  constraint user_profiles_user_id_key unique (user_id),
  constraint user_profiles_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_user_profiles_user_id on public.user_profiles using btree (user_id) TABLESPACE pg_default;

create trigger set_user_profiles_updated_at BEFORE
update on user_profiles for EACH row
execute FUNCTION set_updated_at ();

# Tabela shopping_carts

create table public.shopping_carts (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  last_activity timestamp with time zone null default now(),
  constraint shopping_carts_pkey primary key (id),
  constraint shopping_carts_user_id_key unique (user_id),
  constraint shopping_carts_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create trigger set_shopping_carts_updated_at BEFORE
update on shopping_carts for EACH row
execute FUNCTION set_updated_at ();

# Tabela shipping_addresses

create table public.shipping_addresses (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid not null,
  nome_destinatario character varying(200) not null,
  rua character varying(200) not null,
  numero character varying(20) not null,
  complemento character varying(100) null,
  bairro character varying(100) not null,
  cidade character varying(100) not null,
  estado character varying(50) not null,
  cep character varying(10) not null,
  telefone_contato character varying(20) null,
  is_default boolean null default false,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint shipping_addresses_pkey primary key (id),
  constraint shipping_addresses_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_shipping_addresses_user_id on public.shipping_addresses using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_shipping_addresses_is_default on public.shipping_addresses using btree (is_default) TABLESPACE pg_default;

create trigger ensure_single_default_address_trigger BEFORE INSERT
or
update OF is_default on shipping_addresses for EACH row
execute FUNCTION ensure_single_default_address ();

create trigger set_shipping_addresses_updated_at BEFORE
update on shipping_addresses for EACH row
execute FUNCTION set_updated_at ();

# Tabela products

create table public.products (
  id uuid not null default extensions.uuid_generate_v4 (),
  nome character varying(200) not null,
  descricao text null,
  preco numeric(10, 2) not null,
  quantidade_estoque integer not null default 0,
  category_id uuid null,
  is_active boolean null default true,
  created_by uuid null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  slug character varying(200) null,
  preco_promocional numeric(10, 2) null,
  idade_min integer null default 0,
  idade_max integer null default 12,
  tags text[] null,
  constraint products_pkey primary key (id),
  constraint products_slug_key unique (slug),
  constraint products_created_by_fkey foreign KEY (created_by) references auth.users (id),
  constraint products_category_id_fkey foreign KEY (category_id) references categories (id) on delete set null,
  constraint products_idade_max_check check ((idade_max >= idade_min)),
  constraint products_idade_min_check check ((idade_min >= 0)),
  constraint products_preco_check check ((preco >= (0)::numeric)),
  constraint products_quantidade_estoque_check check ((quantidade_estoque >= 0))
) TABLESPACE pg_default;

create index IF not exists idx_products_category_id on public.products using btree (category_id) TABLESPACE pg_default;

create index IF not exists idx_products_created_by on public.products using btree (created_by) TABLESPACE pg_default;

create index IF not exists idx_products_nome on public.products using btree (nome) TABLESPACE pg_default;

create index IF not exists idx_products_active on public.products using btree (is_active) TABLESPACE pg_default;

create index IF not exists idx_products_slug on public.products using btree (slug) TABLESPACE pg_default;

create trigger audit_product_changes_trigger
after INSERT
or DELETE
or
update on products for EACH row
execute FUNCTION audit_product_changes ();

create trigger set_product_slug_trigger BEFORE INSERT
or
update on products for EACH row
execute FUNCTION set_product_slug ();

create trigger set_products_updated_at BEFORE
update on products for EACH row
execute FUNCTION set_updated_at ();

create trigger track_product_price_changes
after
update on products for EACH row when (new.preco is distinct from old.preco)
execute FUNCTION track_price_changes ();

# Tabela product_variants

create table public.product_variants (
  id uuid not null default extensions.uuid_generate_v4 (),
  product_id uuid not null,
  nome_variante character varying(100) not null,
  preco_adicional numeric(10, 2) not null default 0,
  quantidade_estoque integer not null default 0,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint product_variants_pkey primary key (id),
  constraint product_variants_product_id_fkey foreign KEY (product_id) references products (id) on delete CASCADE,
  constraint product_variants_quantidade_estoque_check check ((quantidade_estoque >= 0))
) TABLESPACE pg_default;

create index IF not exists idx_product_variants_product_id on public.product_variants using btree (product_id) TABLESPACE pg_default;

create trigger set_product_variants_updated_at BEFORE
update on product_variants for EACH row
execute FUNCTION set_updated_at ();

# Tabela product_reviews

create table public.product_reviews (
  id uuid not null default extensions.uuid_generate_v4 (),
  product_id uuid not null,
  user_id uuid not null,
  order_item_id uuid not null,
  rating integer not null,
  comentario text null,
  is_approved boolean null default false,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint product_reviews_pkey primary key (id),
  constraint product_reviews_product_id_user_id_order_item_id_key unique (product_id, user_id, order_item_id),
  constraint product_reviews_order_item_id_fkey foreign KEY (order_item_id) references order_items (id) on delete CASCADE,
  constraint product_reviews_product_id_fkey foreign KEY (product_id) references products (id) on delete CASCADE,
  constraint product_reviews_user_id_fkey foreign KEY (user_id) references auth.users (id),
  constraint product_reviews_rating_check check (
    (
      (rating >= 1)
      and (rating <= 5)
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_product_reviews_product_id on public.product_reviews using btree (product_id) TABLESPACE pg_default;

create index IF not exists idx_product_reviews_user_id on public.product_reviews using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_product_reviews_product_rating on public.product_reviews using btree (product_id, rating) TABLESPACE pg_default;

create trigger set_product_reviews_updated_at BEFORE
update on product_reviews for EACH row
execute FUNCTION set_updated_at ();

# Tabela product_images

create table public.product_images (
  id uuid not null default extensions.uuid_generate_v4 (),
  product_id uuid not null,
  image_url text not null,
  is_primary boolean null default false,
  ordem_exibicao integer null default 0,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint product_images_pkey primary key (id),
  constraint product_images_product_id_fkey foreign KEY (product_id) references products (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_product_images_product_id on public.product_images using btree (product_id) TABLESPACE pg_default;

create trigger set_product_images_updated_at BEFORE
update on product_images for EACH row
execute FUNCTION set_updated_at ();

# Tabela price_history

create table public.price_history (
  id uuid not null default extensions.uuid_generate_v4 (),
  product_id uuid not null,
  preco_anterior numeric(10, 2) not null,
  preco_novo numeric(10, 2) not null,
  changed_by uuid null,
  created_at timestamp with time zone null default now(),
  constraint price_history_pkey primary key (id),
  constraint price_history_changed_by_fkey foreign KEY (changed_by) references auth.users (id),
  constraint price_history_product_id_fkey foreign KEY (product_id) references products (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_price_history_product_id on public.price_history using btree (product_id) TABLESPACE pg_default;

create index IF not exists idx_price_history_product_date on public.price_history using btree (product_id, created_at) TABLESPACE pg_default;

# Tabela orders

create table public.orders (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid not null,
  status public.order_status not null default 'pendente'::order_status,
  valor_total numeric(10, 2) not null,
  metodo_pagamento public.payment_method null,
  payment_id character varying(100) null,
  external_reference character varying(100) null,
  payment_details jsonb null,
  desconto_aplicado numeric(10, 2) null default 0,
  discount_id uuid null,
  shipping_address_id uuid null,
  endereco_entrega_snapshot jsonb not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint orders_pkey primary key (id),
  constraint orders_external_reference_key unique (external_reference),
  constraint orders_discount_id_fkey foreign KEY (discount_id) references discounts (id) on delete set null,
  constraint orders_shipping_address_id_fkey foreign KEY (shipping_address_id) references shipping_addresses (id) on delete set null,
  constraint orders_user_id_fkey foreign KEY (user_id) references auth.users (id),
  constraint orders_valor_total_check check ((valor_total >= (0)::numeric))
) TABLESPACE pg_default;

create index IF not exists idx_orders_user_id on public.orders using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_orders_discount_id on public.orders using btree (discount_id) TABLESPACE pg_default;

create index IF not exists idx_orders_status on public.orders using btree (status) TABLESPACE pg_default;

create index IF not exists idx_orders_payment_id on public.orders using btree (payment_id) TABLESPACE pg_default;

create index IF not exists idx_orders_external_reference on public.orders using btree (external_reference) TABLESPACE pg_default;

create index IF not exists idx_orders_user_date on public.orders using btree (user_id, created_at) TABLESPACE pg_default;

create index IF not exists idx_orders_date_status on public.orders using btree (created_at, status) TABLESPACE pg_default;

create trigger set_orders_updated_at BEFORE
update on orders for EACH row
execute FUNCTION set_updated_at ();

# Tabela order_items

create table public.order_items (
  id uuid not null default extensions.uuid_generate_v4 (),
  order_id uuid not null,
  product_id uuid not null,
  product_variant_id uuid null,
  quantidade integer not null,
  preco_unitario numeric(10, 2) not null,
  preco_total numeric(10, 2) not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint order_items_pkey primary key (id),
  constraint order_items_product_id_fkey foreign KEY (product_id) references products (id),
  constraint order_items_product_variant_id_fkey foreign KEY (product_variant_id) references product_variants (id) on delete set null,
  constraint order_items_order_id_fkey foreign KEY (order_id) references orders (id) on delete CASCADE,
  constraint order_items_preco_unitario_check check ((preco_unitario >= (0)::numeric)),
  constraint order_items_preco_total_check check ((preco_total >= (0)::numeric)),
  constraint order_items_quantidade_check check ((quantidade > 0))
) TABLESPACE pg_default;

create index IF not exists idx_order_items_order_id on public.order_items using btree (order_id) TABLESPACE pg_default;

create index IF not exists idx_order_items_product_id on public.order_items using btree (product_id) TABLESPACE pg_default;

create trigger set_order_items_updated_at BEFORE
update on order_items for EACH row
execute FUNCTION set_updated_at ();

create trigger update_order_total_on_items_change
after INSERT
or DELETE
or
update on order_items for EACH row
execute FUNCTION calculate_order_total ();

# Tabela discounts

create table public.discounts (
  id uuid not null default extensions.uuid_generate_v4 (),
  codigo character varying(50) not null,
  tipo public.discount_type not null,
  valor numeric(10, 2) not null,
  valor_minimo_pedido numeric(10, 2) null default 0,
  max_usos integer null,
  quantidade_usada integer null default 0,
  data_inicio timestamp with time zone not null,
  data_fim timestamp with time zone not null,
  is_active boolean null default true,
  created_by uuid null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint discounts_pkey primary key (id),
  constraint discounts_codigo_key unique (codigo),
  constraint discounts_created_by_fkey foreign KEY (created_by) references auth.users (id),
  constraint discounts_check check ((data_fim > data_inicio)),
  constraint discounts_valor_check check ((valor >= (0)::numeric))
) TABLESPACE pg_default;

create index IF not exists idx_discounts_created_by on public.discounts using btree (created_by) TABLESPACE pg_default;

create index IF not exists idx_discounts_codigo on public.discounts using btree (codigo) TABLESPACE pg_default;

create index IF not exists idx_discounts_active on public.discounts using btree (is_active) TABLESPACE pg_default;

create index IF not exists idx_discounts_date_range on public.discounts using btree (data_inicio, data_fim) TABLESPACE pg_default;

create trigger set_discounts_updated_at BEFORE
update on discounts for EACH row
execute FUNCTION set_updated_at ();

# Tabela discount_usage

create table public.discount_usage (
  id uuid not null default extensions.uuid_generate_v4 (),
  discount_id uuid not null,
  user_id uuid not null,
  order_id uuid not null,
  used_at timestamp with time zone null default now(),
  constraint discount_usage_pkey primary key (id),
  constraint discount_usage_discount_id_order_id_key unique (discount_id, order_id),
  constraint discount_usage_discount_id_fkey foreign KEY (discount_id) references discounts (id) on delete CASCADE,
  constraint discount_usage_order_id_fkey foreign KEY (order_id) references orders (id) on delete CASCADE,
  constraint discount_usage_user_id_fkey foreign KEY (user_id) references auth.users (id)
) TABLESPACE pg_default;

create index IF not exists idx_discount_usage_discount_id on public.discount_usage using btree (discount_id) TABLESPACE pg_default;

create index IF not exists idx_discount_usage_user_id on public.discount_usage using btree (user_id) TABLESPACE pg_default;

# Tabela categories

create table public.categories (
  id uuid not null default extensions.uuid_generate_v4 (),
  nome character varying(100) not null,
  descricao text null,
  parent_id uuid null,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  slug character varying(100) null,
  imagem_url text null,
  constraint categories_pkey primary key (id),
  constraint categories_nome_key unique (nome),
  constraint categories_slug_key unique (slug),
  constraint categories_parent_id_fkey foreign KEY (parent_id) references categories (id) on delete set null
) TABLESPACE pg_default;

create index IF not exists idx_categories_parent_id on public.categories using btree (parent_id) TABLESPACE pg_default;

create index IF not exists idx_categories_slug on public.categories using btree (slug) TABLESPACE pg_default;

create trigger set_category_slug_trigger BEFORE INSERT
or
update on categories for EACH row
execute FUNCTION set_category_slug ();

# Tabela cart_items

create table public.cart_items (
  id uuid not null default extensions.uuid_generate_v4 (),
  cart_id uuid not null,
  product_id uuid not null,
  product_variant_id uuid null,
  quantidade integer not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint cart_items_pkey primary key (id),
  constraint cart_items_cart_id_product_id_product_variant_id_key unique (cart_id, product_id, product_variant_id),
  constraint cart_items_cart_id_fkey foreign KEY (cart_id) references shopping_carts (id) on delete CASCADE,
  constraint cart_items_product_id_fkey foreign KEY (product_id) references products (id) on delete CASCADE,
  constraint cart_items_product_variant_id_fkey foreign KEY (product_variant_id) references product_variants (id) on delete set null,
  constraint cart_items_quantidade_check check ((quantidade > 0))
) TABLESPACE pg_default;

create index IF not exists idx_cart_items_cart_id on public.cart_items using btree (cart_id) TABLESPACE pg_default;

create index IF not exists idx_cart_items_product_id on public.cart_items using btree (product_id) TABLESPACE pg_default;

create trigger set_cart_items_updated_at BEFORE
update on cart_items for EACH row
execute FUNCTION set_updated_at ();

create trigger update_cart_last_activity_trigger
after INSERT
or
update on cart_items for EACH row
execute FUNCTION update_cart_last_activity ();

# Tabela blog_posts

create table public.blog_posts (
  id uuid not null default extensions.uuid_generate_v4 (),
  titulo character varying(200) not null,
  slug character varying(200) not null,
  conteudo text not null,
  resumo text null,
  imagem_destaque_url text null,
  author_id uuid null,
  is_published boolean null default false,
  published_at timestamp with time zone null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  like_count integer null default 0,
  view_count integer null default 0,
  author_nome text null,
  author_sobrenome text null,
  constraint blog_posts_pkey primary key (id),
  constraint blog_posts_slug_key unique (slug),
  constraint blog_posts_author_id_fkey foreign KEY (author_id) references auth.users (id)
) TABLESPACE pg_default;

create index IF not exists idx_blog_posts_author_id on public.blog_posts using btree (author_id) TABLESPACE pg_default;

create index IF not exists idx_blog_posts_slug on public.blog_posts using btree (slug) TABLESPACE pg_default;

create index IF not exists idx_blog_posts_published on public.blog_posts using btree (is_published) TABLESPACE pg_default;

create trigger set_blog_posts_updated_at BEFORE
update on blog_posts for EACH row
execute FUNCTION set_updated_at ();

# Tabela blog_post_likes

create table public.blog_post_likes (
  id uuid not null default extensions.uuid_generate_v4 (),
  post_id uuid not null,
  user_id uuid not null,
  created_at timestamp with time zone null default now(),
  constraint blog_post_likes_pkey primary key (id),
  constraint blog_post_likes_post_id_user_id_key unique (post_id, user_id),
  constraint blog_post_likes_post_id_fkey foreign KEY (post_id) references blog_posts (id) on delete CASCADE,
  constraint blog_post_likes_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_blog_post_likes_post_id on public.blog_post_likes using btree (post_id) TABLESPACE pg_default;

create index IF not exists idx_blog_post_likes_user_id on public.blog_post_likes using btree (user_id) TABLESPACE pg_default;

create trigger update_post_likes_trigger
after INSERT
or DELETE on blog_post_likes for EACH row
execute FUNCTION update_post_like_count ();

# Tabela blog_post_categories

create table public.blog_post_categories (
  post_id uuid not null,
  category_id uuid not null,
  constraint blog_post_categories_pkey primary key (post_id, category_id),
  constraint blog_post_categories_category_id_fkey foreign KEY (category_id) references blog_categories (id) on delete CASCADE,
  constraint blog_post_categories_post_id_fkey foreign KEY (post_id) references blog_posts (id) on delete CASCADE
) TABLESPACE pg_default;

# Tabela blog_comments

create table public.blog_comments (
  id uuid not null default extensions.uuid_generate_v4 (),
  post_id uuid not null,
  user_id uuid not null,
  conteudo text not null,
  is_approved boolean null default false,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  like_count integer null default 0,
  parent_comment_id uuid null,
  constraint blog_comments_pkey primary key (id),
  constraint blog_comments_parent_comment_id_fkey foreign KEY (parent_comment_id) references blog_comments (id) on delete CASCADE,
  constraint blog_comments_post_id_fkey foreign KEY (post_id) references blog_posts (id) on delete CASCADE,
  constraint blog_comments_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_blog_comments_post_id on public.blog_comments using btree (post_id) TABLESPACE pg_default;

create index IF not exists idx_blog_comments_user_id on public.blog_comments using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_blog_comments_parent_id on public.blog_comments using btree (parent_comment_id) TABLESPACE pg_default;

create trigger set_blog_comments_updated_at BEFORE
update on blog_comments for EACH row
execute FUNCTION set_updated_at ();

# Tabela blog_comment_likes

create table public.blog_comment_likes (
  id uuid not null default extensions.uuid_generate_v4 (),
  comment_id uuid not null,
  user_id uuid not null,
  created_at timestamp with time zone null default now(),
  constraint blog_comment_likes_pkey primary key (id),
  constraint blog_comment_likes_comment_id_user_id_key unique (comment_id, user_id),
  constraint blog_comment_likes_comment_id_fkey foreign KEY (comment_id) references blog_comments (id) on delete CASCADE,
  constraint blog_comment_likes_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_blog_comment_likes_comment_id on public.blog_comment_likes using btree (comment_id) TABLESPACE pg_default;

create index IF not exists idx_blog_comment_likes_user_id on public.blog_comment_likes using btree (user_id) TABLESPACE pg_default;

create trigger update_comment_likes_trigger
after INSERT
or DELETE on blog_comment_likes for EACH row
execute FUNCTION update_comment_like_count ();

# Tabela blog_categories

create table public.blog_categories (
  id uuid not null default extensions.uuid_generate_v4 (),
  nome character varying(100) not null,
  descricao text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint blog_categories_pkey primary key (id),
  constraint blog_categories_nome_key unique (nome)
) TABLESPACE pg_default;

# Tabela audit_logs

create table public.audit_logs (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid null,
  action character varying(10) not null,
  table_name character varying(50) not null,
  record_id uuid not null,
  old_data jsonb null,
  new_data jsonb null,
  ip_address character varying(45) null,
  user_agent text null,
  created_at timestamp with time zone null default now(),
  constraint audit_logs_pkey primary key (id),
  constraint audit_logs_user_id_fkey foreign KEY (user_id) references auth.users (id),
  constraint audit_logs_action_check check (
    (
      (action)::text = any (
        (
          array[
            'insert'::character varying,
            'update'::character varying,
            'delete'::character varying
          ]
        )::text[]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_audit_logs_user_id on public.audit_logs using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_audit_logs_table_name on public.audit_logs using btree (table_name) TABLESPACE pg_default;

create table public.blog_post_saves (
  id uuid not null default extensions.uuid_generate_v4 (),
  post_id uuid not null,
  user_id uuid not null,
  created_at timestamp with time zone null default now(),
  constraint blog_post_saves_pkey primary key (id),
  constraint blog_post_saves_post_id_user_id_key unique (post_id, user_id),
  constraint blog_post_saves_post_id_fkey foreign KEY (post_id) references blog_posts (id) on delete CASCADE,
  constraint blog_post_saves_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_blog_post_saves_post_id on public.blog_post_saves using btree (post_id) TABLESPACE pg_default;

create index IF not exists idx_blog_post_saves_user_id on public.blog_post_saves using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_blog_post_saves_user_post on public.blog_post_saves using btree (user_id, post_id) TABLESPACE pg_default;

create index IF not exists idx_blog_post_saves_user_created on public.blog_post_saves using btree (user_id, created_at desc) TABLESPACE pg_default;

#POLICES##########3

#audit_logs

Name: Admins podem ver logs de auditoria
Action: PERMISSIVE
Command: SELECT
Target roles: public
USING expression: (EXISTS ( SELECT 1 FROM user_profiles up WHERE ((up.user_id = auth.uid()) AND (up.role = 'admin'::user_role))))
CHECK expression: None

Name: Service role bypass
Action: PERMISSIVE
Command: ALL
Target roles: public
USING expression: (auth.role() = 'service_role'::text)
CHECK expression: (auth.role() = 'service_role'::text)

#blog_categories

Name: Permitir leitura pública de categorias do blog
Action: PERMISSIVE
Command: SELECT
Target roles: public
USING expression: true
CHECK expression: none

Name: Service role bypass
Action: PERMISSIVE
Command: ALL
Target roles: public
USING expression: (auth.role() = 'service_role'::text)
CHECK expression: (auth.role() = 'service_role'::text)

#blog_comment_likes

Name: Service role bypass
Action: PERMISSIVE
Command: ALL
Target roles: public
USING expression: (auth.role() = 'service_role'::text)
CHECK expression: (auth.role() = 'service_role'::text)

Name: Usuários autenticados podem ver seus próprios likes de coment
Action: PERMISSIVE
Command: SELECT
Target roles: authenticated
USING expression: (auth.uid() = user_id)
CHECK expression: None

Name: Usuários podem gerenciar seus próprios likes de comentários
Action: PERMISSIVE
Command: INSERT
Target roles: authenticated
USING expression: 
CHECK expression: (auth.uid() = user_id)

Name: Usuários podem remover seus próprios likes de comentários
Action: PERMISSIVE
Command: DELETE
Target roles: authenticated
USING expression: (auth.uid() = user_id)
CHECK expression: none

#blog_comments

Name: Admins podem gerenciar todos os comentários
Action: PERMISSIVE
Command: ALL
Target roles: public
USING expression: (EXISTS ( SELECT 1 FROM user_profiles up WHERE ((up.user_id = auth.uid()) AND (up.role = 'admin'::user_role))))
CHECK expression: (EXISTS ( SELECT 1 FROM user_profiles up WHERE ((up.user_id = auth.uid()) AND (up.role = 'admin'::user_role))))

Name: Comentários aprovados são visíveis para todos
Action: PERMISSIVE
Command: SELECT
Target roles: public
USING expression: (is_approved = true)
CHECK expression: None

Name: Service role bypass
Action: PERMISSIVE
Command: ALL
Target roles: public
USING expression: (auth.role() = 'service_role'::text)
CHECK expression: (auth.role() = 'service_role'::text)

Name: Usuários podem atualizar seus próprios comentários
Action: PERMISSIVE
Command: UPDATE
Target roles: public
USING expression: (auth.uid() = user_id)
CHECK expression: None

Name: Usuários podem criar comentários
Action: PERMISSIVE
Command: INSERT
Target roles: public
USING expression:
CHECK expression: (auth.uid() = user_id)

Name: Usuários podem ver seus próprios comentários
Action: PERMISSIVE
Command: SELECT
Target roles: public
USING expression: (auth.uid() = user_id)
CHECK expression: None

#blog_post_categories

Name: Permitir exclusão de blog_post_categories para admins
Action: PERMISSIVE
Command: DELETE
Target roles: authenticated
USING expression: (EXISTS ( SELECT 1 FROM blog_posts WHERE ((blog_posts.id = blog_post_categories.post_id) AND (blog_posts.author_id = auth.uid()))))
CHECK expression: None

Name: Permitir inserção em blog_post_categories para admins
Action: PERMISSIVE
Command: INSERT
Target roles: authenticated
USING expression: 
CHECK expression: (EXISTS ( SELECT 1 FROM blog_posts WHERE ((blog_posts.id = blog_post_categories.post_id) AND (blog_posts.author_id = auth.uid()))))

Name: Permitir leitura pública de relações post-categoria
Action: PERMISSIVE
Command: SELECT
Target roles: public
USING expression: true
CHECK expression: 

Name: Service role bypass
Action: PERMISSIVE
Command: ALL
Target roles: public
USING expression: (auth.role() = 'service_role'::text)
CHECK expression: (auth.role() = 'service_role'::text)

#blog_post_likes

Name: Service role bypass
Action: PERMISSIVE
Command: ALL
Target roles: public
USING expression: (auth.role() = 'service_role'::text)
CHECK expression: (auth.role() = 'service_role'::text)

Name: Usuários autenticados podem ver seus próprios likes de posts
Action: PERMISSIVE
Command: SELECT
Target roles: authenticated
USING expression: (auth.uid() = user_id)
CHECK expression: None

Name: Usuários podem gerenciar seus próprios likes de posts
Action: PERMISSIVE
Command: INSERT
Target roles: authenticated
USING expression: 
CHECK expression: (auth.uid() = user_id)

Name: Usuários podem remover seus próprios likes de posts
Action: PERMISSIVE
Command: DELETE
Target roles: authenticated
USING expression: (auth.uid() = user_id)
CHECK expression: None

#blog_post_saves

Name: Administradores podem ver todos os posts salvos
Action: PERMISSIVE
Command: SELECT
Target roles: authenticated
USING expression: (EXISTS ( SELECT 1 FROM user_profiles WHERE ((user_profiles.user_id = auth.uid()) AND (user_profiles.role = 'admin'::user_role))))
CHECK expression: None

Name: Usuários podem remover seus posts salvos
Action: PERMISSIVE
Command: DELETE
Target roles: authenticated
USING expression: (auth.uid() = user_id)
CHECK expression: None

Name: Usuários podem salvar posts
Action: PERMISSIVE
Command: INSERT
Target roles: authenticated
USING expression: 
CHECK expression: (auth.uid() = user_id)

Name: Usuários podem ver seus próprios posts salvos
Action: PERMISSIVE
Command: SELECT
Target roles: authenticated
USING expression: (auth.uid() = user_id)
CHECK expression: None

#blog_posts

Name: Admins podem gerenciar posts
Action: PERMISSIVE
Command: ALL
Target roles: public
USING expression: (EXISTS ( SELECT 1 FROM user_profiles up WHERE ((up.user_id = auth.uid()) AND (up.role = 'admin'::user_role))))
CHECK expression: (EXISTS ( SELECT 1 FROM user_profiles up WHERE ((up.user_id = auth.uid()) AND (up.role = 'admin'::user_role))))

Name: Permitir leitura de TODOS os posts para admins
Action: PERMISSIVE
Command: SELECT
Target roles: authenticated
USING expression: (auth.uid() IN ( SELECT user_profiles.user_id FROM user_profiles WHERE ((user_profiles.role)::text = 'admin'::text)))
CHECK expression: None

Name: Posts publicados visiveis para publico
Action: PERMISSIVE
Command: SELECT
Target roles: public
USING expression: (is_published = true)
CHECK expression: None

Name: Service role bypass
Action: PERMISSIVE
Command: ALL
Target roles: public
USING expression: (auth.role() = 'service_role'::text)
CHECK expression: (auth.role() = 'service_role'::text)

#cart_items

Name: Service role bypass
Action: PERMISSIVE
Command: ALL
Target roles: public
USING expression: (auth.role() = 'service_role'::text)
CHECK expression: (auth.role() = 'service_role'::text)

Name: Usuários podem gerenciar itens do seu carrinho
Action: PERMISSIVE
Command: ALL
Target roles: public
USING expression: (EXISTS ( SELECT 1 FROM shopping_carts sc WHERE ((sc.id = cart_items.cart_id) AND (sc.user_id = auth.uid()))))
CHECK expression: (EXISTS ( SELECT 1 FROM shopping_carts sc WHERE ((sc.id = cart_items.cart_id) AND (sc.user_id = auth.uid()))))

Name: Usuários veem apenas itens do seu carrinho
Action: PERMISSIVE
Command: SELECT
Target roles: public
USING expression: (EXISTS ( SELECT 1 FROM shopping_carts sc WHERE ((sc.id = cart_items.cart_id) AND (sc.user_id = auth.uid()))))
CHECK expression: None

#categories

Name: Admins podem gerenciar categorias
Action: PERMISSIVE
Command: ALL
Target roles: public
USING expression: (EXISTS ( SELECT 1 FROM user_profiles up WHERE ((up.user_id = auth.uid()) AND (up.role = 'admin'::user_role))))
CHECK expression: (EXISTS ( SELECT 1 FROM user_profiles up WHERE ((up.user_id = auth.uid()) AND (up.role = 'admin'::user_role))))

Name: Categorias visíveis para todos
Action: PERMISSIVE
Command: SELECT
Target roles: public
USING expression: (is_active = true)
CHECK expression: None

Name: Service role bypass
Action: PERMISSIVE
Command: ALL
Target roles: public
USING expression: (auth.role() = 'service_role'::text)
CHECK expression: (auth.role() = 'service_role'::text)

#discount_usage

Name: Service role bypass
Action: PERMISSIVE
Command: ALL
Target roles: public
USING expression: (auth.role() = 'service_role'::text)
CHECK expression: (auth.role() = 'service_role'::text)

#discounts

Name: Admins podem gerenciar cupons
Action: PERMISSIVE
Command: ALL
Target roles: public
USING expression: (EXISTS ( SELECT 1 FROM user_profiles up WHERE ((up.user_id = auth.uid()) AND (up.role = 'admin'::user_role))))
CHECK expression: (EXISTS ( SELECT 1 FROM user_profiles up WHERE ((up.user_id = auth.uid()) AND (up.role = 'admin'::user_role))))

Name: Cupons ativos visíveis para todos
Action: PERMISSIVE
Command: SELECT
Target roles: public
USING expression: (is_active = true)
CHECK expression: None

Name: Service role bypass
Action: PERMISSIVE
Command: ALL
Target roles: public
USING expression: (auth.role() = 'service_role'::text)
CHECK expression: (auth.role() = 'service_role'::text)

#order_items

Name: Admins veem todos os itens de pedidos
Action: PERMISSIVE
Command: SELECT
Target roles: public
USING expression: (EXISTS ( SELECT 1 FROM user_profiles up WHERE ((up.user_id = auth.uid()) AND (up.role = 'admin'::user_role))))
CHECK expression: None

Name: Service role bypass
Action: PERMISSIVE
Command: ALL
Target roles: public
USING expression: (auth.role() = 'service_role'::text)
CHECK expression: (auth.role() = 'service_role'::text)

Name: Usuários veem itens dos seus pedidos
Action: PERMISSIVE
Command: SELECT
Target roles: public
USING expression: (EXISTS ( SELECT 1 FROM orders o WHERE ((o.id = order_items.order_id) AND (o.user_id = auth.uid()))))
CHECK expression: None

#orders

Name: Admins podem atualizar pedidos
Action: PERMISSIVE
Command: UPDATE
Target roles: public
USING expression: (EXISTS ( SELECT 1 FROM user_profiles up WHERE ((up.user_id = auth.uid()) AND (up.role = 'admin'::user_role))))
CHECK expression: None

Name: Admins veem todos os pedidos
Action: PERMISSIVE
Command: SELECT
Target roles: public
USING expression: (EXISTS ( SELECT 1 FROM user_profiles up WHERE ((up.user_id = auth.uid()) AND (up.role = 'admin'::user_role))))
CHECK expression: None

Name: Service role bypass
Action: PERMISSIVE
Command: ALL
Target roles: public
USING expression: (auth.role() = 'service_role'::text)
CHECK expression: (auth.role() = 'service_role'::text)

Name: Usuários podem criar seus próprios pedidos
Action: PERMISSIVE
Command: INSERT
Target roles: public
USING expression: 
CHECK expression: (auth.uid() = user_id)

Name: Usuários veem apenas seus próprios pedidos
Action: PERMISSIVE
Command: SELECT
Target roles: public
USING expression: (auth.uid() = user_id)
CHECK expression: None

#price_history

Name: Service role bypass
Action: PERMISSIVE
Command: ALL
Target roles: public
USING expression: (auth.role() = 'service_role'::text)
CHECK expression: (auth.role() = 'service_role'::text)

#product_images

Name: Admins podem gerenciar imagens de produtos
Action: PERMISSIVE
Command: ALL
Target roles: public
USING expression: (EXISTS ( SELECT 1 FROM user_profiles up WHERE ((up.user_id = auth.uid()) AND (up.role = 'admin'::user_role))))
CHECK expression: (EXISTS ( SELECT 1 FROM user_profiles up WHERE ((up.user_id = auth.uid()) AND (up.role = 'admin'::user_role))))

Name: Imagens de produtos visíveis para todos
Action: PERMISSIVE
Command: SELECT
Target roles: public
USING expression: (EXISTS ( SELECT 1 FROM products p WHERE ((p.id = product_images.product_id) AND (p.is_active = true))))
CHECK expression: None

Name: Service role bypass
Action: PERMISSIVE
Command: ALL
Target roles: public
USING expression: (auth.role() = 'service_role'::text)
CHECK expression: (auth.role() = 'service_role'::text)

#product_reviews

Name: Admins podem gerenciar todas as avaliações
Action: PERMISSIVE
Command: ALL
Target roles: public
USING expression: (EXISTS ( SELECT 1 FROM user_profiles up WHERE ((up.user_id = auth.uid()) AND (up.role = 'admin'::user_role))))
CHECK expression: (EXISTS ( SELECT 1 FROM user_profiles up WHERE ((up.user_id = auth.uid()) AND (up.role = 'admin'::user_role))))

Name: Avaliações aprovadas visíveis para todos
Action: PERMISSIVE
Command: SELECT
Target roles: public
USING expression: (is_approved = true)
CHECK expression: None

Name: Service role bypass
Action: PERMISSIVE
Command: ALL
Target roles: public
USING expression: (auth.role() = 'service_role'::text)
CHECK expression: (auth.role() = 'service_role'::text)

Name: Usuários podem atualizar suas próprias avaliações
Action: PERMISSIVE
Command: UPDATE
Target roles: public
USING expression: (auth.uid() = user_id)
CHECK expression: None

Name: Usuários podem criar avaliações
Action: PERMISSIVE
Command: INSERT
Target roles: public
USING expression: 
CHECK expression: (auth.uid() = user_id)

Name: Usuários podem ver suas próprias avaliações
Action: PERMISSIVE
Command: SELECT
Target roles: public
USING expression: (auth.uid() = user_id)
CHECK expression: None

#product_variants

Name: Service role bypass
Action: PERMISSIVE
Command: ALL
Target roles: public
USING expression: (auth.role() = 'service_role'::text)
CHECK expression: (auth.role() = 'service_role'::text)

#products

Name: Admins podem atualizar produtos
Action: PERMISSIVE
Command: UPDATE
Target roles: public
USING expression: (EXISTS ( SELECT 1 FROM user_profiles up WHERE ((up.user_id = auth.uid()) AND (up.role = 'admin'::user_role))))
CHECK expression: None

Name: Admins podem criar produtos
Action: PERMISSIVE
Command: INSERT
Target roles: public
USING expression: 
CHECK expression: (EXISTS ( SELECT 1 FROM user_profiles up WHERE ((up.user_id = auth.uid()) AND (up.role = 'admin'::user_role))))

Name: Admins podem excluir produtos
Action: PERMISSIVE
Command: DELETE
Target roles: public
USING expression: (EXISTS ( SELECT 1 FROM user_profiles up WHERE ((up.user_id = auth.uid()) AND (up.role = 'admin'::user_role))))
CHECK expression: None

Name: Produtos visíveis para todos
Action: PERMISSIVE
Command: SELECT
Target roles: public
USING expression: (is_active = true)
CHECK expression: None

Name: Service role bypass
Action: PERMISSIVE
Command: ALL
Target roles: public
USING expression: (auth.role() = 'service_role'::text)
CHECK expression: (auth.role() = 'service_role'::text)

#shipping_addresses

Name: Service role bypass
Action: PERMISSIVE
Command: ALL
Target roles: public
USING expression: (auth.role() = 'service_role'::text)
CHECK expression: (auth.role() = 'service_role'::text)

Name: users_delete_own_addresses
Action: PERMISSIVE
Command: DELETE
Target roles: authenticated
USING expression: (auth.uid() = user_id)
CHECK expression: None

Name: users_insert_own_addresses
Action: PERMISSIVE
Command: INSERT
Target roles: authenticated
USING expression: 
CHECK expression: (auth.uid() = user_id)

Name: users_update_own_addresses
Action: PERMISSIVE
Command: UPDATE
Target roles: authenticated
USING expression: (auth.uid() = user_id)
CHECK expression: (auth.uid() = user_id)

Name: users_view_own_addresses
Action: PERMISSIVE
Command: SELECT
Target roles: authenticated
USING expression: (auth.uid() = user_id)
CHECK expression: None

Name: Usuários podem gerenciar seus endereços
Action: PERMISSIVE
Command: ALL
Target roles: public
USING expression: (auth.uid() = user_id)
CHECK expression: (auth.uid() = user_id)

Name: Usuários veem apenas seus próprios endereços
Action: PERMISSIVE
Command: SELECT
Target roles: public
USING expression: (auth.uid() = user_id)
CHECK expression: None

#shopping_carts

Name: Service role bypass
Action: PERMISSIVE
Command: ALL
Target roles: public
USING expression: (auth.role() = 'service_role'::text)
CHECK expression: (auth.role() = 'service_role'::text)

Name: Usuários podem gerenciar seu próprio carrinho
Action: PERMISSIVE
Command: ALL
Target roles: public
USING expression: (auth.uid() = user_id)
CHECK expression: (auth.uid() = user_id)

Name: Usuários veem apenas seu próprio carrinho
Action: PERMISSIVE
Command: SELECT
Target roles: public
USING expression: (auth.uid() = user_id)
CHECK expression: None

#user_profiles

Name: Admins podem atualizar todos os perfis de usuário
Action: PERMISSIVE
Command: UPDATE
Target roles: authenticated
USING expression: is_admin(auth.uid())
CHECK expression: is_admin(auth.uid())

Name: Admins podem ler todos os perfis de usuário
Action: PERMISSIVE
Command: SELECT
Target roles: authenticated
USING expression: is_admin(auth.uid())
CHECK expression: None

Name: Service role bypass
Action: PERMISSIVE
Command: ALL
Target roles: public
USING expression: (auth.role() = 'service_role'::text)
CHECK expression: (auth.role() = 'service_role'::text)

Name: Usuários podem atualizar seu próprio perfil
Action: PERMISSIVE
Command: UPDATE
Target roles: authenticated
USING expression: (auth.uid() = user_id)
CHECK expression: None

Name: Usuários podem ver seu próprio perfil
Action: PERMISSIVE
Command: SELECT
Target roles: authenticated
USING expression: (auth.uid() = user_id)
CHECK expression: None

Name: Usuários veem apenas seu próprio perfil
Action: PERMISSIVE
Command: SELECT
Target roles: public
USING expression: (auth.uid() = user_id)
CHECK expression: None

#Politicas do bucket (lorena-images-db)

Permitir exclusão de imagens da pasta blog-post para admins
{authenticated}
((bucket_id = 'lorena-images-db'::text) AND (name ~~ 'blog-post/%'::text) AND (auth.role() = 'authenticated'::text) AND (auth.uid() IN ( SELECT user_profiles.user_id
   FROM user_profiles
  WHERE ((user_profiles.role)::text = 'admin'::text))))

Permitir seleção de imagens da pasta blog-post para admins
{Defaults to all (public) roles if none selected}
((bucket_id = 'lorena-images-db'::text) AND (name ~~ 'blog-post/%'::text) AND (auth.role() = 'authenticated'::text) AND (auth.uid() IN ( SELECT user_profiles.user_id
   FROM user_profiles
  WHERE ((user_profiles.role)::text = 'admin'::text))))

Permitir upload de imagens do blog para admins
{authenticated}
((bucket_id = 'lorena-images-db'::text) AND (auth.uid() IN ( SELECT user_profiles.user_id
   FROM user_profiles
  WHERE (user_profiles.role = 'admin'::user_role))))

Profile pics are publicly accessible
{Defaults to all (public) roles if none selected}
((bucket_id = 'lorena-images-db'::text) AND ((storage.foldername(name))[1] = 'profile-pic'::text))

Users can delete own profile pics
{authenticated}
((bucket_id = 'lorena-images-db'::text) AND ((storage.foldername(name))[1] = 'profile-pic'::text) AND (storage.filename(name) ~~ (('%'::text || (auth.uid())::text) || '%'::text)))

Users can update own profile pics
{authenticated}
((bucket_id = 'lorena-images-db'::text) AND ((storage.foldername(name))[1] = 'profile-pic'::text) AND (storage.filename(name) ~~ (('%'::text || (auth.uid())::text) || '%'::text)))
WITH CHECK expression:
((bucket_id = 'lorena-images-db'::text) AND ((storage.foldername(name))[1] = 'profile-pic'::text) AND (storage.filename(name) ~~ (('%'::text || (auth.uid())::text) || '%'::text)))

Users can upload own profile pics
{authenticated}
((bucket_id = 'lorena-images-db'::text) AND ((storage.foldername(name))[1] = 'profile-pic'::text) AND (storage.filename(name) ~~ (('%'::text || (auth.uid())::text) || '%'::text)))
