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
  is_published: boolean; // Mantido o boolean diretamente
}

// Interface para os dados do perfil do usuário que queremos
export interface UserProfileInfo {
  nome: string;
  sobrenome: string;
}

export interface BlogPostFromDB {
  id: string; // UUID
  titulo: string;
  slug: string;
  resumo: string | null;
  conteudo: string;
  imagem_destaque_url: string | null;
  author_id: string | null; // Este é o user_id de auth.users
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string | null;
  user_profiles: UserProfileInfo | null; // Armazenará { nome, sobrenome }
  blog_post_categories: { blog_categories: { id: string; nome: string; } }[];
  like_count: number;
  view_count: number; // Presumindo que você adicionará ou já tem este campo
}

export interface BlogCategoryFromDB {
  id: string; // UUID
  nome: string;
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
  return user.id; // Retorna o user.id da tabela auth.users
}

export async function createPost(formData: PostFormData) {
  const supabase = await createClient();
  try {
    const author_id = await getAuthenticatedAdminId(); // Este é o user.id
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
          author_id: author_id, // Salva o user.id do Supabase Auth
          is_published: formData.is_published, // Usa o valor booleano diretamente
          published_at: formData.is_published ? new Date().toISOString() : null,
        }
      ])
      .select('id, slug')
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
      }
    }

    revalidatePath('/admin/blog');
    if (formData.is_published) {
      revalidatePath(`/blog/${postData.slug}`);
    }
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

    const { data: existingPost, error: fetchError } = await supabase
      .from('blog_posts')
      .select('published_at, is_published, slug') // Adicionado slug para revalidação correta
      .eq('id', postId)
      .single();

    if (fetchError) throw fetchError;
    if (!existingPost) throw new Error("Post não encontrado para atualização.");

    const { data, error: postError } = await supabase
      .from('blog_posts')
      .update({
        titulo: formData.titulo,
        slug: formData.slug,
        resumo: formData.resumo,
        conteudo: sanitizedContent,
        imagem_destaque_url: formData.imagem_destaque_url || null,
        updated_at: new Date().toISOString(),
        is_published: formData.is_published,
        published_at: (formData.is_published && !existingPost.published_at)
                        ? new Date().toISOString()
                        : (!formData.is_published && existingPost.published_at)
                          ? null
                          : existingPost.published_at,
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
    // Revalidar o slug antigo e o novo slug se mudou, e se estava ou vai ser publicado
    if (existingPost.slug !== data.slug) {
        if (existingPost.is_published) revalidatePath(`/blog/${existingPost.slug}`);
    }
    if (formData.is_published) revalidatePath(`/blog/${data.slug}`);
    
    revalidatePath(`/admin/blog/editar/${postId}`);
    return { success: true, message: "Post atualizado com sucesso!", post: data };
  } catch (error: any) {
    return { success: false, message: error.message || "Falha ao atualizar post." };
  }
}

// Ajustado o tipo de retorno para corresponder ao BlogPostFromDB
export async function getPostForEdit(id: string): Promise<(Omit<BlogPostFromDB, 'user_profiles' | 'blog_post_categories'> & { user_profiles: UserProfileInfo | null; categorias: string[] }) | null> {
  const supabase = await createClient();
  try {
    await getAuthenticatedAdminId();
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select(`
        id, titulo, slug, resumo, conteudo, imagem_destaque_url, author_id, 
        is_published, published_at, created_at, updated_at, like_count, view_count,
        blog_post_categories(category_id)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!post) return null;

    let userProfileData: UserProfileInfo | null = null;
    if (post.author_id) {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('nome, sobrenome')
        .eq('user_id', post.author_id) // Assumindo que author_id é o user_id
        .single();
      
      if (profileError) {
        console.error(`Erro ao buscar perfil do autor ${post.author_id} para o post ${id}:`, profileError.message);
      } else {
        userProfileData = profile;
      }
    }
    
    const categories = post.blog_post_categories ? (post.blog_post_categories as any[]).map(pc => pc.category_id) : [];
    
    // Remove blog_post_categories do post antes de espalhar, pois já processamos
    const { blog_post_categories, ...restOfPost } = post;

    return { 
      ...restOfPost, 
      like_count: post.like_count ?? 0,
      view_count: post.view_count ?? 0, // Certifique-se que view_count existe na sua tabela ou defina um padrão
      user_profiles: userProfileData, // Anexa os dados do perfil buscados
      categorias: categories as string[] // Nomes das categorias já processados
    };
  } catch (error: any) {
    console.error(`Erro ao buscar post ${id} para edição:`, error.message);
    return null;
  }
}

export async function getBlogCategories(): Promise<BlogCategoryFromDB[]> {
  const supabase = await createClient();
  try {
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

export async function getAdminBlogPosts(): Promise<BlogPostFromDB[]> {
  const supabase = await createClient();
  try {
    await getAuthenticatedAdminId(); 

    const { data: postsData, error: postsError } = await supabase
      .from('blog_posts')
      .select(`
        id, titulo, slug, resumo, conteudo, imagem_destaque_url, author_id, 
        is_published, published_at, created_at, updated_at, like_count, view_count,
        blog_post_categories ( blog_categories ( id, nome ) )
      `)
      .order('created_at', { ascending: false });

    if (postsError) {
      console.error("Erro ao buscar posts para admin:", postsError.message);
      throw postsError; // Lança o erro para ser tratado onde a função é chamada
    }

    if (!postsData || postsData.length === 0) {
      console.log("Nenhum post encontrado no banco de dados para admin");
      return [];
    }
    
    const authorIds = [...new Set(postsData.map(p => p.author_id).filter(id => id !== null))] as string[];
    
    let userProfilesMap: Map<string, UserProfileInfo> = new Map();

    if (authorIds.length > 0) {
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('user_id, nome, sobrenome')
        .in('user_id', authorIds);

      if (profilesError) {
        console.error("Erro ao buscar perfis de usuários para admin:", profilesError.message);
        // Não lançar erro aqui, apenas os posts não terão info de autor
      } else if (profilesData) {
        profilesData.forEach(profile => {
          if (profile.user_id) {
            userProfilesMap.set(profile.user_id, { nome: profile.nome, sobrenome: profile.sobrenome });
          }
        });
      }
    }
    
    const formattedPosts: BlogPostFromDB[] = postsData.map(post => ({
      ...post,
      conteudo: post.conteudo || '', 
      is_published: post.is_published || false,
      like_count: post.like_count ?? 0,
      view_count: post.view_count ?? 0,
      user_profiles: post.author_id ? userProfilesMap.get(post.author_id) || null : null,
      blog_post_categories: post.blog_post_categories || [],
    }));

    return formattedPosts;
  } catch (error: any) {
    console.error("Exceção ao buscar posts para admin:", error.message);
    return []; // Retorna array vazio em caso de exceção não tratada
  }
}

export async function deletePost(postId: string): Promise<{ success: boolean, message: string }> {
  const supabase = await createClient();
  try {
    await getAuthenticatedAdminId();

    const { error: catError } = await supabase
      .from('blog_post_categories')
      .delete()
      .eq('post_id', postId);

    if (catError) {
      console.error(`Erro ao deletar associações de categorias para o post ${postId}:`, catError.message);
    }

    const { error: postError } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', postId);

    if (postError) throw postError;

    revalidatePath('/admin/blog');
    
    return { success: true, message: "Post excluído com sucesso." };
  } catch (error: any) {
    return { success: false, message: error.message || "Falha ao excluir post." };
  }
}