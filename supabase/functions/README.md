# Edge Functions para Blog Lorena Jacob

Este diretório contém as Edge Functions que alimentam o blog público e administrativo do site da Lorena Jacob, Terapeuta Infantil. As funções são executadas na infraestrutura do Supabase, oferecendo melhor desempenho, segurança e escalabilidade.

## Estrutura de Pastas

- **`_shared/`**: Utilitários compartilhados por todas as funções
  - `supabase.ts`: Inicialização do cliente Supabase
  - `cors.ts`: Configurações para CORS
  - `utils.ts`: Funções utilitárias (respostas JSON, tratamento de erros)

- **`blog-posts/`**: API para listar posts do blog público
- **`blog-post/`**: API para visualizar um post específico por slug
- **`blog-categories/`**: API para listar categorias do blog
- **`blog-popular/`**: API para buscar posts populares (mais likes/visualizações)

## Endpoints

| Endpoint | Método | Parâmetros | Descrição |
|----------|--------|------------|-----------|
| `/blog-posts` | GET | `limit=10` `page=1` `categoria=uuid` `busca=termo` | Lista posts publicados paginados com filtros |
| `/blog-post/[slug]` | GET | `slug` (parte da URL) | Retorna post completo pelo slug e incrementa views |
| `/blog-categories` | GET | - | Lista categorias do blog com contagem de posts |
| `/blog-popular` | GET | `limit=3` | Retorna posts mais populares |

## Desenvolvimento Local

Para executar localmente:

```bash
supabase functions serve --env-file .env.local
```

Requisitos no `.env.local`:

```
SUPABASE_URL=sua_url_do_supabase
SUPABASE_SERVICE_ROLE_KEY=chave_service_role_do_supabase 
SUPABASE_ANON_KEY=chave_anon_do_supabase
```

## Deploy

Para fazer deploy das funções:

```bash
supabase functions deploy --no-verify-jwt
```

Para funções que precisam de autenticação (área admin):

```bash 
supabase functions deploy admin-functions --verify-jwt
```

## Uso no Frontend

Exemplo de uso com `fetch` nas páginas Next.js:

```typescript
// Para listar posts do blog
const response = await fetch(
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/blog-posts?limit=10&page=1`
);
const { data } = await response.json();

// Para buscar post pelo slug
const response = await fetch(
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/blog-post/${slug}`
);
const { data } = await response.json();
```

Ou com cliente Supabase:

```typescript
const { data } = await supabase.functions.invoke('blog-posts', {
  method: 'GET',
  query: { limit: 10, page: 1 }
});
```

## Segurança

Estas funções utilizam o cliente Supabase anônimo para operações públicas, garantindo que apenas conteúdo público (com `is_published = true`) seja acessível. As políticas de segurança RLS do Supabase continuam sendo aplicadas.
