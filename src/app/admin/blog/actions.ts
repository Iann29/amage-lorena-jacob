// src/app/admin/blog/actions.ts
"use server";

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { JSDOM } from 'jsdom';
import DOMPurifyServer from 'dompurify';

const windowInstance = new JSDOM('').window;
const purify = DOMPurifyServer(windowInstance as unknown as Window);

interface PostFormData {
  titulo: string;
  slug: string;
  resumo: string;
  conteudo: string;
  categorias: string[]; // Array de IDs de categoria (UUIDs)
  imagem_destaque_url?: string;
  is_published?: boolean;
}

// Tipos para os posts e categorias retornados do Supabase
export interface BlogPostFromDB {
  id: string; // UUID
  titulo: string;
  slug: string;
  resumo: string | null;
  conteudo: string;
  imagem_destaque_url: string | null;
  author_id: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string | null;
  // Relações (podem precisar de ajuste dependendo da sua consulta)
  user_profiles: { nome: string; sobrenome: string; } | null; // Para nome do autor
  blog_post_categories: { blog_categories: { id: string; nome: string; } }[]; // Para categorias
  like_count?: number; // Se você tiver
  view_count?: number; // Se você tiver
}

export interface BlogCategoryFromDB {
  id: string; // UUID
  nome: string;
  // Adicione outros campos se necessário, como 'slug'
}


async function getAuthenticatedAdminId() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Erro de autenticação na Server Action:", authError?.message);
    throw new Error("Usuário não autenticado.");
  }

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (profileError) {
    console.error("Erro ao buscar perfil do usuário:", profileError.message);
    throw new Error("Não foi possível verificar as permissões do usuário.");
  }

  if (!profile || profile.role !== 'admin') {
    console.warn(`Tentativa de acesso não autorizada por user_id: ${user.id} com role: ${profile?.role}`);
    throw new Error("Acesso não autorizado. Requer privilégios de administrador.");
  }
  return user.id;
}

export async function createPost(formData: PostFormData) {
  const supabase = await createClient();
  try {
    const author_id = await getAuthenticatedAdminId();
    const sanitizedContent = purify.sanitize(formData.conteudo, { USE_PROFILES: { html: true } });

    const { data: postData, error: postError } = await supabase
      .from('blog_posts')
      .insert([
        {
          titulo: formData.titulo,
          slug: formData.slug,
          resumo: formData.resumo,
          conteudo: sanitizedContent,
          imagem_destaque_url: formData.imagem_destaque_url || null,
          author_id: author_id,
          is_published: formData.is_published === undefined ? false : formData.is_published,
          published_at: formData.is_published ? new Date().toISOString() : null,
        }
      ])
      .select('id, slug') // Selecionar slug para revalidação
      .single();

    if (postError) throw postError;
    if (!postData) throw new Error("Falha ao criar o post.");

    if (formData.categorias && formData.categorias.length > 0) {
      const postCategories = formData.categorias.map(catId => ({
        post_id: postData.id,
        category_id: catId,
      }));
      const { error: catError } = await supabase.from('blog_post_categories').insert(postCategories);
      if (catError) {
        console.error("Erro ao associar categorias:", catError.message);
        // Considerar se deve lançar um erro aqui ou apenas logar
      }
    }

    revalidatePath('/admin/blog');
    revalidatePath(`/blog/${postData.slug}`); // Usar o slug retornado
    return { success: true, message: "Post criado com sucesso!", postId: postData.id };
  } catch (error: any) {
    return { success: false, message: error.message || "Falha ao criar post." };
  }
}

export async function updatePost(postId: string, formData: PostFormData) {
  const supabase = await createClient();
  try {
    await getAuthenticatedAdminId();
    const sanitizedContent = purify.sanitize(formData.conteudo, { USE_PROFILES: { html: true } });

    const { data, error: postError } = await supabase
      .from('blog_posts')
      .update({
        titulo: formData.titulo,
        slug: formData.slug,
        resumo: formData.resumo,
        conteudo: sanitizedContent,
        imagem_destaque_url: formData.imagem_destaque_url || null,
        updated_at: new Date().toISOString(),
        is_published: formData.is_published === undefined ? false : formData.is_published,
        // Adicionar published_at se estiver publicando
        published_at: (formData.is_published && !(await supabase.from('blog_posts').select('published_at').eq('id', postId).single()).data?.published_at) 
                        ? new Date().toISOString() 
                        : undefined,
      })
      .eq('id', postId)
      .select('id, slug') // Selecionar slug para revalidação
      .single();

    if (postError) throw postError;
    if (!data) throw new Error("Falha ao atualizar o post.");

    await supabase.from('blog_post_categories').delete().eq('post_id', postId);
    if (formData.categorias && formData.categorias.length > 0) {
      const postCategories = formData.categorias.map(catId => ({
        post_id: postId,
        category_id: catId,
      }));
      const { error: catError } = await supabase.from('blog_post_categories').insert(postCategories);
       if (catError) {
        console.error("Erro ao atualizar associação de categorias:", catError.message);
      }
    }

    revalidatePath('/admin/blog');
    revalidatePath(`/blog/${data.slug}`);
    revalidatePath(`/admin/blog/editar/${postId}`);
    return { success: true, message: "Post atualizado com sucesso!", post: data };
  } catch (error: any) {
    return { success: false, message: error.message || "Falha ao atualizar post." };
  }
}

export async function getPostForEdit(id: string) {
  const supabase = await createClient();
  try {
    await getAuthenticatedAdminId();
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_post_categories(category_id)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!post) return null;
    
    const categories = post.blog_post_categories ? (post.blog_post_categories as any[]).map(pc => pc.category_id) : [];
    return { ...post, categorias: categories as string[] };
  } catch (error: any) {
    console.error(`Erro ao buscar post ${id} para edição:`, error.message);
    return null;
  }
}

export async function getBlogCategories(): Promise<BlogCategoryFromDB[]> {
  const supabase = await createClient();
  try {
    // Não precisa de autenticação de admin para listar categorias se forem públicas
    const { data, error } = await supabase
      .from('blog_categories')
      .select('id, nome')
      .order('nome', { ascending: true });
    if (error) {
        console.error("Erro ao buscar categorias do blog (RLS pode estar faltando?):", error.message);
        throw error;
    };
    return data || [];
  } catch (error: any) {
    console.error("Exceção ao buscar categorias do blog:", error.message);
    return [];
  }
}

// NOVA ACTION: Buscar todos os posts para a página de admin
export async function getAdminBlogPosts(): Promise<BlogPostFromDB[]> {
  const supabase = await createClient();
  try {
    await getAuthenticatedAdminId(); 

    // Consulta modificada para incluir author_id e fazer join com user_profiles
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select(`
        id,
        titulo,
        slug,
        resumo,
        imagem_destaque_url,
        created_at,
        is_published,
        view_count, 
        like_count,
        author_id,
        user_profiles!inner ( user_id, nome, sobrenome ),
        blog_post_categories (
          blog_categories ( id, nome )
        )
      `)
      // Filtro para garantir que estamos unindo corretamente se author_id não for nulo
      // Esta parte pode não ser estritamente necessária se a RLS já garante que
      // apenas posts com autores válidos (para o admin) são retornados,
      // mas é uma boa prática para joins explícitos.
      // .not('author_id', 'is', null) // Descomente se tiver posts sem author_id e quiser filtrá-los
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erro ao buscar posts para admin:", error.message);
      throw error;
    }

    // Se a consulta acima não funcionar com o join implícito via author_id -> user_profiles(user_id)
    // podemos precisar mapear manualmente, mas vamos tentar a forma mais idiomática do Supabase primeiro.
    // O Supabase deveria conseguir relacionar blog_posts.author_id com user_profiles.user_id
    // porque ambos são essencialmente o auth.uid().

    // Se user_profiles retornar null para alguns posts, pode ser que o author_id
    // não tenha um perfil correspondente ou a RLS ainda está bloqueando de alguma forma.

    // Verificação e ajuste manual se necessário (Alternativa menos ideal, mas funciona):
    // O ideal é que a query acima já traga os dados corretamente.
    // Se a query aninhada não funcionar como esperado, você teria que fazer duas queries:
    // 1. Buscar os posts.
    // 2. Para cada post, buscar o perfil do autor usando author_id.
    // Mas a sintaxe do Supabase com !inner ou !fk_column_name deveria funcionar.

    return posts || [];
  } catch (error: any) {
    console.error("Exceção ao buscar posts para admin:", error.message);
    return [];
  }
}

// NOVA ACTION: Deletar um post
export async function deletePost(postId: string): Promise<{ success: boolean, message: string }> {
  const supabase = await createClient();
  try {
    await getAuthenticatedAdminId();

    // Primeiro, deletar as associações em blog_post_categories
    const { error: catError } = await supabase
      .from('blog_post_categories')
      .delete()
      .eq('post_id', postId);

    if (catError) {
      console.error(`Erro ao deletar associações de categorias para o post ${postId}:`, catError.message);
      // Decidir se quer parar aqui ou continuar para deletar o post
    }

    // Depois deletar os comentários associados (se houver RLS que não permita cascade)
    // Normalmente o ON DELETE CASCADE na FK resolveria isso, mas para garantir:
    // await supabase.from('blog_comments').delete().eq('post_id', postId);
    // await supabase.from('blog_post_likes').delete().eq('post_id', postId);


    const { error: postError } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', postId);

    if (postError) throw postError;

    revalidatePath('/admin/blog');
    // Adicionar revalidação de outras páginas se necessário (ex: /blog, /blog/[slug])
    
    return { success: true, message: "Post excluído com sucesso." };
  } catch (error: any) {
    return { success: false, message: error.message || "Falha ao excluir post." };
  }
}