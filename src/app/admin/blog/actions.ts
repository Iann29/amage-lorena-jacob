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
  categorias: string[];
  imagem_destaque_url?: string;
  is_published: boolean;
}

export interface UserProfileInfo {
  nome: string;
  sobrenome: string;
}

export interface BlogPostFromDB {
  id: string;
  titulo: string;
  slug: string;
  resumo: string | null;
  conteudo: string;
  imagem_destaque_url: string | null;
  author_id: string | null;
  author_nome?: string | null;
  author_sobrenome?: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string | null;
  user_profiles?: UserProfileInfo | null;
  blog_post_categories: {
    category_id?: string;
    blog_categories?: { id: string; nome: string; }
  }[];
  like_count: number;
  view_count: number;
  categorias: string[];
  categoriasInfo?: { id: string; nome: string; }[];
}

export interface BlogCategoryFromDB {
  id: string;
  nome: string;
}

// Função auxiliar para extrair o path do objeto da URL pública do Supabase Storage
function getStoragePathFromUrl(url: string | null | undefined, bucketName: string): string | null {
  if (!url) {
    return null;
  }
  try {
    const urlObject = new URL(url);
    // Ex: /storage/v1/object/public/BUCKET_NAME/pasta/arquivo.jpg
    const pathParts = urlObject.pathname.split('/');
    const bucketIndex = pathParts.indexOf(bucketName);

    if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
      // Pega todas as partes DEPOIS do nome do bucket e junta com '/'
      return pathParts.slice(bucketIndex + 1).join('/');
    }
    console.warn(`Não foi possível encontrar o bucket '${bucketName}' no pathname: ${urlObject.pathname}`);
    return null; // Bucket não encontrado no path da URL
  } catch (e) {
    console.error("Erro ao parsear a URL do storage:", url, e);
    return null; // URL inválida
  }
}

export async function getAuthenticatedAdminId() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Usuário não autenticado.");

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles').select('role').eq('user_id', user.id).single();
  if (profileError) throw new Error("Não foi possível verificar permissões.");
  if (!profile || profile.role !== 'admin') throw new Error("Acesso não autorizado (admin requerido).");
  return user.id;
}

export async function createPost(formData: PostFormData) {
  const supabase = await createClient();
  try {
    const author_id = await getAuthenticatedAdminId();
    let author_nome = "Lorena"; let author_sobrenome = "Jacob";

    const { data: authorProfile } = await supabase
      .from('user_profiles').select('nome, sobrenome')
      .eq('user_id', author_id).maybeSingle();
    if (authorProfile) {
      author_nome = authorProfile.nome || author_nome;
      author_sobrenome = authorProfile.sobrenome || author_sobrenome;
    }

    const sanitizedContent = purify.sanitize(formData.conteudo, { USE_PROFILES: { html: true } });

    const { data: postData, error: postError } = await supabase
      .from('blog_posts')
      .insert([{
        titulo: formData.titulo, slug: formData.slug, resumo: formData.resumo,
        conteudo: sanitizedContent, imagem_destaque_url: formData.imagem_destaque_url || null,
        author_id: author_id, author_nome: author_nome, author_sobrenome: author_sobrenome,
        is_published: formData.is_published,
        published_at: formData.is_published ? new Date().toISOString() : null,
        view_count: 0, like_count: 0,
      }])
      .select('id, slug').single();

    if (postError) throw postError;
    if (!postData) throw new Error("Falha ao criar post (sem retorno).");

    if (formData.categorias && formData.categorias.length > 0) {
      const postCategories = formData.categorias.map(catId => ({ post_id: postData.id, category_id: catId }));
      await supabase.from('blog_post_categories').insert(postCategories);
    }

    revalidatePath('/admin/blog');
    if (formData.is_published) {
      revalidatePath('/blog'); revalidatePath(`/blog/${postData.slug}`);
    }
    return { success: true, message: "Post criado!", postId: postData.id };
  } catch (error: any) {
    console.error("Erro completo ao criar post:", error);
    return { success: false, message: error.message || "Falha ao criar post." };
  }
}

export async function updatePost(
    postId: string,
    formData: PostFormData,
    oldImageUrlFromClient?: string | null
) {
  const supabase = await createClient();
  try {
    await getAuthenticatedAdminId();
    const newImageUrl = formData.imagem_destaque_url || null;

    if (newImageUrl !== oldImageUrlFromClient && oldImageUrlFromClient) {
      const oldPath = getStoragePathFromUrl(oldImageUrlFromClient, 'lorena-images-db'); // <<< SEU BUCKET
      if (oldPath) {
        try {
          console.log("[updatePost Action] Removendo imagem antiga:", oldPath);
          await supabase.storage.from('lorena-images-db').remove([oldPath]); // <<< SEU BUCKET
        } catch (e: any) { console.error("Erro não fatal ao remover img antiga:", e.message); }
      }
    }

    const sanitizedContent = purify.sanitize(formData.conteudo, { USE_PROFILES: { html: true } });
    const { data: existingPostData } = await supabase
       .from('blog_posts').select('published_at, is_published, slug').eq('id', postId).single();
    if (!existingPostData) throw new Error("Post não encontrado.");

    const { data, error: postError } = await supabase
      .from('blog_posts')
      .update({
        titulo: formData.titulo, slug: formData.slug, resumo: formData.resumo,
        conteudo: sanitizedContent, imagem_destaque_url: newImageUrl,
        updated_at: new Date().toISOString(), is_published: formData.is_published,
        published_at: (formData.is_published && !existingPostData.published_at) ? new Date().toISOString()
                      : (!formData.is_published && existingPostData.published_at) ? null
                      : existingPostData.published_at,
      })
      .eq('id', postId).select('id, slug').single();

    if (postError) throw postError;
    if (!data) throw new Error("Falha ao atualizar post.");

    await supabase.from('blog_post_categories').delete().eq('post_id', postId);
    if (formData.categorias && formData.categorias.length > 0) {
      const postCategories = formData.categorias.map(catId => ({ post_id: postId, category_id: catId }));
      await supabase.from('blog_post_categories').insert(postCategories);
    }

    revalidatePath('/admin/blog');
    if (existingPostData.slug !== data.slug && existingPostData.is_published) revalidatePath(`/blog/${existingPostData.slug}`);
    if (formData.is_published) { revalidatePath('/blog'); revalidatePath(`/blog/${data.slug}`); }
    else if (existingPostData.is_published) { revalidatePath('/blog'); revalidatePath(`/blog/${existingPostData.slug}`); }
    revalidatePath(`/admin/blog/editar/${postId}`);

    return { success: true, message: "Post atualizado!", post: data };
  } catch (error: any) {
    console.error("Erro completo ao atualizar post:", error);
    return { success: false, message: error.message || "Falha ao atualizar." };
  }
}

export async function getPostForEdit(id: string): Promise<(Omit<BlogPostFromDB, 'user_profiles' | 'blog_post_categories'> & { user_profiles: UserProfileInfo | null; categorias: string[] }) | null> {
  const supabase = await createClient();
  try {
    await getAuthenticatedAdminId();
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select(`
        id, titulo, slug, resumo, conteudo, imagem_destaque_url, author_id, author_nome, author_sobrenome,
        is_published, published_at, created_at, updated_at, like_count, view_count,
        blog_post_categories( category_id, blog_categories(id, nome) )
      `).eq('id', id).single();

    if (error) { if (error.code === 'PGRST116') return null; throw error; }
    if (!post) return null;

    let userProfileData: UserProfileInfo | null = { nome: post.author_nome || 'Autor', sobrenome: post.author_sobrenome || '' };
    const categoryIds: string[] = post.blog_post_categories?.map(pc => pc.blog_categories?.id ?? pc.category_id).filter(Boolean) as string[] || [];
    const { blog_post_categories, author_nome, author_sobrenome, ...restOfPost } = post;

    return {
      ...restOfPost,
      like_count: post.like_count ?? 0, view_count: post.view_count ?? 0,
      user_profiles: userProfileData, categorias: categoryIds
    };
  } catch (error: any) {
    console.error(`Erro GERAL buscar post ${id} edit:`, error.message); return null;
  }
}

export async function getBlogCategories(): Promise<BlogCategoryFromDB[]> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('blog_categories').select('id, nome').order('nome', { ascending: true });
    if (error) { console.error("Erro buscar categorias:", error.message); return []; }
    return data || [];
  } catch (error: any) { console.error("Exceção buscar categorias:", error.message); return []; }
}

export async function getAdminBlogPosts(): Promise<BlogPostFromDB[]> {
    const supabase = await createClient();
    try {
        await getAuthenticatedAdminId();
        const { data: postsData, error: postsError } = await supabase
            .from('blog_posts')
            .select(`
                id, titulo, slug, resumo, conteudo, imagem_destaque_url,
                author_id, author_nome, author_sobrenome,
                is_published, published_at, created_at, updated_at, like_count, view_count,
                blog_post_categories ( category_id, blog_categories ( id, nome ) )
            `).order('created_at', { ascending: false });

        if (postsError) { console.error("Erro buscar posts admin:", postsError.message); throw postsError; }
        if (!postsData) return [];

        return postsData.map(post => {
             const categoryIds: string[] = [];
             const categoriesInfo: { id: string; nome: string; }[] = [];
             let postCategoriesData: any[] = [];
             if (post.blog_post_categories && Array.isArray(post.blog_post_categories)) {
                postCategoriesData = post.blog_post_categories;
                for (const pc of post.blog_post_categories) {
                     if (pc.blog_categories?.id && pc.blog_categories?.nome) {
                        categoryIds.push(pc.blog_categories.id);
                        categoriesInfo.push({ id: pc.blog_categories.id, nome: pc.blog_categories.nome });
                    }
                }
             }
             return {
                 ...post, conteudo: post.conteudo || '', like_count: post.like_count ?? 0, view_count: post.view_count ?? 0,
                 user_profiles: { nome: post.author_nome || 'Autor', sobrenome: post.author_sobrenome || '' },
                 blog_post_categories: postCategoriesData, categorias: categoryIds, categoriasInfo: categoriesInfo
             } as BlogPostFromDB;
        });
    } catch (error: any) { console.error("Exceção buscar posts admin:", error.message); return []; }
}

// Nova função para estatísticas do Dashboard
export async function getDashboardBlogStats() {
  const supabase = await createClient();
  try {
    await getAuthenticatedAdminId();

    const { count: totalPosts, error: postsError } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });

    if (postsError) {
      console.error("Erro ao contar posts para o dashboard:", postsError.message);
      throw postsError;
    }

    const { data: statsData, error: statsError } = await supabase
      .from('blog_posts')
      .select('view_count, like_count');

    if (statsError) {
      console.error("Erro ao buscar estatísticas de visualizações e curtidas:", statsError.message);
      throw statsError;
    }

    const totalVisualizacoes = statsData?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0;
    const totalLikes = statsData?.reduce((sum, post) => sum + (post.like_count || 0), 0) || 0;

    // Por enquanto, não vamos buscar totalComentarios aqui,
    // a menos que você confirme que tem uma tabela e como ela se chama.
    // const totalComentarios = 0; // Placeholder

    return {
      success: true,
      data: {
        totalPosts: totalPosts || 0,
        totalVisualizacoes,
        totalLikes,
        // totalComentarios // Adicionar se implementado
      }
    };
  } catch (error: any) {
    console.error("Erro geral ao buscar estatísticas do dashboard:", error.message);
    return { success: false, message: error.message, data: null };
  }
}

// Função para buscar posts recentes para o Dashboard
export async function getRecentPostsForDashboard(limit: number = 5) {
  const supabase = await createClient();
  try {
    // Não é necessário getAuthenticatedAdminId() aqui se os posts recentes não forem sensíveis
    // ou se a página do dashboard já for protegida.
    // Se precisar de proteção, descomente a linha abaixo:
    // await getAuthenticatedAdminId();

    const { data: recentPosts, error } = await supabase
      .from('blog_posts')
      .select('id, titulo, created_at, view_count')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Erro ao buscar posts recentes para o dashboard:", error.message);
      throw error;
    }
    return { success: true, data: recentPosts || [] };
  } catch (error: any) {
    console.error("Erro geral ao buscar posts recentes para o dashboard:", error.message);
    return { success: false, message: error.message, data: [] };
  }
}

// === deletePost AGORA TENTA DELETAR A IMAGEM ===
export async function deletePost(postId: string): Promise<{ success: boolean, message: string }> {
  const supabase = await createClient();
  let imageUrlToDelete: string | null = null; // Variável para guardar a URL

  try {
    await getAuthenticatedAdminId();

    // 1. Buscar a URL da imagem ANTES de deletar o post
    const { data: postData, error: fetchError } = await supabase
        .from('blog_posts').select('imagem_destaque_url').eq('id', postId).maybeSingle();

    // Se deu erro na busca (e não foi 'não encontrado'), joga o erro
    if (fetchError && fetchError.code !== 'PGRST116') {
        console.error(`Erro ao buscar post ${postId} para exclusão:`, fetchError.message);
        throw new Error("Falha ao buscar dados do post para exclusão.");
    }
    imageUrlToDelete = postData?.imagem_destaque_url || null; // Guarda a URL

    // 2. Deletar o post do banco (CASCADE deve cuidar das categorias, etc.)
    const { error: postError } = await supabase.from('blog_posts').delete().eq('id', postId);
    if (postError) {
        console.error(`Erro ao deletar post ${postId} do banco:`, postError.message);
        throw postError; // Se não deletou o post, não adianta deletar imagem
    }
    console.log(`Post ${postId} deletado do banco.`);

    // 3. Tentar deletar a imagem do Storage (SE existir URL)
    if (imageUrlToDelete) {
        const pathToDelete = getStoragePathFromUrl(imageUrlToDelete, 'lorena-images-db'); // <<< SEU BUCKET
        console.log(`[deletePost Action] Tentando remover imagem do storage. Path: ${pathToDelete}`);

        if (pathToDelete) {
            try {
                const { error: deleteImgError } = await supabase.storage
                     .from('lorena-images-db') // <<< SEU BUCKET
                     .remove([pathToDelete]);

                if (deleteImgError) {
                    // Loga o erro mas NÃO lança exceção, pois o post já foi deletado.
                    console.error(`[deletePost Action] Erro NÃO FATAL ao remover imagem '${pathToDelete}':`, deleteImgError);
                } else {
                    console.log(`[deletePost Action] Imagem '${pathToDelete}' removida do storage.`);
                }
            } catch (e:any) {
                console.error(`[deletePost Action] Exceção ao tentar remover imagem '${pathToDelete}':`, e.message);
            }
        } else {
            console.warn(`[deletePost Action] Não foi possível extrair path válido da URL para deletar: ${imageUrlToDelete}`);
        }
    } else {
        console.log(`[deletePost Action] Post ${postId} não possuía imagem para remover.`);
    }

    // Revalidação
    revalidatePath('/admin/blog');
    revalidatePath('/blog'); // Revalidar blog público também

    return { success: true, message: "Post excluído com sucesso." };

  } catch (error: any) {
    // Captura erros da busca inicial ou da deleção do post no DB
    console.error("Erro GERAL ao excluir post:", error);
    return { success: false, message: error.message || "Falha ao excluir post." };
  }
}