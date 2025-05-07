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
  // A estrutura retornada pelo Supabase para relaciones aninhadas
  blog_post_categories: { 
    category_id?: string;
    blog_categories?: { 
      id: string; 
      nome: string; 
    } 
  }[];
  like_count: number;
  view_count: number;
  // Campos adicionais para uso na UI
  categorias: string[]; // Lista de IDs de categorias para uso no formulário
  categoriasInfo?: { id: string; nome: string; }[]; // Informações completas das categorias
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

/**
 * Cria um novo post de blog, incluindo a associação com categorias
 * @param formData Dados do formulário de criação do post
 * @returns Objeto indicando sucesso ou falha da operação
 */
export async function createPost(formData: PostFormData) {
  const supabase = await createClient();
  try {
    // Obter ID do usuário autenticado (autor do post)
    const author_id = await getAuthenticatedAdminId();
    
    // Buscar nome e sobrenome do autor para armazenar diretamente no post
    let author_nome = "Lorena";
    let author_sobrenome = "Jacob";
    
    if (author_id) {
      const { data: authorProfile, error: authorError } = await supabase
        .from('user_profiles')
        .select('nome, sobrenome')
        .eq('user_id', author_id)
        .single();
      
      if (!authorError && authorProfile) {
        author_nome = authorProfile.nome || author_nome;
        author_sobrenome = authorProfile.sobrenome || author_sobrenome;
      } else if (authorError) {
        console.warn(`Não foi possível buscar dados do autor (ID: ${author_id}):`, authorError.message);
      }
    }
    
    // Sanitizar o conteúdo HTML para segurança
    const sanitizedContent = purify.sanitize(formData.conteudo, { USE_PROFILES: { html: true } });

    // Inserir o post no banco de dados
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
          author_nome: author_nome,
          author_sobrenome: author_sobrenome,
          is_published: formData.is_published,
          published_at: formData.is_published ? new Date().toISOString() : null,
          view_count: 0, // Inicializar contador de visualizações
          like_count: 0, // Inicializar contador de likes
        }
      ])
      .select('id, slug')
      .single();

    if (postError) throw postError;
    if (!postData) throw new Error("Falha ao criar o post.");

    // Associar o post às categorias selecionadas (relação muitos-para-muitos)
    if (formData.categorias && formData.categorias.length > 0) {
      // Criar entries na tabela de junção para cada categoria
      const postCategories = formData.categorias.map(catId => ({
        post_id: postData.id,
        category_id: catId,
      }));
      
      // Inserir na tabela de junção blog_post_categories
      const { error: catError } = await supabase
        .from('blog_post_categories')
        .insert(postCategories);
      
      if (catError) {
        console.error("Erro ao associar categorias ao post:", catError.message);
        // Não lançamos o erro para não invalidar a criação do post que já ocorreu
        // Mas no futuro, pode ser interessante oferecer uma opção de tentar novamente
      }
    }

    // Revalidar o cache das páginas afetadas
    revalidatePath('/admin/blog');
    if (formData.is_published) {
      revalidatePath(`/blog/${postData.slug}`);
    }
    
    return { 
      success: true, 
      message: "Post criado com sucesso!", 
      postId: postData.id 
    };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.message || "Falha ao criar post." 
    };
  }
}

/**
 * Atualiza um post existente, incluindo seus relacionamentos com categorias
 * @param postId ID do post a ser atualizado
 * @param formData Dados do formulário
 * @returns Objeto indicando sucesso ou falha da operação
 */
export async function updatePost(postId: string, formData: PostFormData) {
  const supabase = await createClient();
  try {
    // Verificar se o usuário é admin
    const author_id = await getAuthenticatedAdminId();
    
    // Sanitizar o conteúdo HTML para segurança
    const sanitizedContent = purify.sanitize(formData.conteudo, { USE_PROFILES: { html: true } });
    
    // Buscar nome e sobrenome do autor para armazenar diretamente no post
    let author_nome = "Lorena";
    let author_sobrenome = "Jacob";
    
    if (author_id) {
      const { data: authorProfile, error: authorError } = await supabase
        .from('user_profiles')
        .select('nome, sobrenome')
        .eq('user_id', author_id)
        .single();
      
      if (!authorError && authorProfile) {
        author_nome = authorProfile.nome || author_nome;
        author_sobrenome = authorProfile.sobrenome || author_sobrenome;
      } else if (authorError) {
        console.warn(`Não foi possível buscar dados do autor (ID: ${author_id}):`, authorError.message);
      }
    }

    // Buscar post existente para comparar mudanças
    const { data: existingPost, error: fetchError } = await supabase
      .from('blog_posts')
      .select('published_at, is_published, slug') // Slug para revalidação de cache
      .eq('id', postId)
      .single();

    if (fetchError) throw fetchError;
    if (!existingPost) throw new Error("Post não encontrado para atualização.");

    // Atualizar os dados principais do post
    const { data, error: postError } = await supabase
      .from('blog_posts')
      .update({
        titulo: formData.titulo,
        slug: formData.slug,
        resumo: formData.resumo,
        conteudo: sanitizedContent,
        imagem_destaque_url: formData.imagem_destaque_url || null,
        author_nome: author_nome,
        author_sobrenome: author_sobrenome,
        updated_at: new Date().toISOString(),
        is_published: formData.is_published,
        // Lógica para definir published_at com base no status anterior e atual
        published_at: (formData.is_published && !existingPost.published_at)
                        ? new Date().toISOString() // Se publicando pela primeira vez
                        : (!formData.is_published && existingPost.published_at)
                          ? null // Se despublicando
                          : existingPost.published_at, // Mantém o valor existente
      })
      .eq('id', postId)
      .select('id, slug') // Selecionar slug para revalidação
      .single();

    if (postError) throw postError;
    if (!data) throw new Error("Falha ao atualizar o post.");

    // Atualizar associações de categorias - primeiro remover todas as existentes
    const { error: deleteError } = await supabase
      .from('blog_post_categories')
      .delete()
      .eq('post_id', postId);
    
    if (deleteError) {
      console.error("Erro ao remover associações de categorias existentes:", deleteError.message);
      // Não lançamos error aqui para não invalidar a atualização do post que já ocorreu
    }
    
    // Inserir novas associações de categorias se existirem
    if (formData.categorias && formData.categorias.length > 0) {
      const postCategories = formData.categorias.map(catId => ({
        post_id: postId,
        category_id: catId,
      }));
      
      const { error: catError } = await supabase
        .from('blog_post_categories')
        .insert(postCategories);
        
      if (catError) {
        console.error("Erro ao atualizar associação de categorias:", catError.message);
        // Não lançamos error para não invalidar a atualização do post que já ocorreu
      }
    }

    // Revalidar caches para atualizar a interface
    revalidatePath('/admin/blog');
    
    // Revalidar URLs do frontend se o post estiver publicado
    if (existingPost.slug !== data.slug) {
      // Se o slug mudou, revalidar também a URL antiga
      if (existingPost.is_published) revalidatePath(`/blog/${existingPost.slug}`);
    }
    if (formData.is_published) revalidatePath(`/blog/${data.slug}`);
    
    // Revalidar a página de edição do post
    revalidatePath(`/admin/blog/editar/${postId}`);
    
    return { success: true, message: "Post atualizado com sucesso!", post: data };
  } catch (error: any) {
    return { success: false, message: error.message || "Falha ao atualizar post." };
  }
}

/**
 * Busca um post do blog para edição, incluindo suas categorias associadas
 * @param id ID do post a ser editado
 * @returns Dados do post formatados para o formulário de edição
 */
export async function getPostForEdit(id: string): Promise<(Omit<BlogPostFromDB, 'user_profiles' | 'blog_post_categories'> & { user_profiles: UserProfileInfo | null; categorias: string[] }) | null> {
  const supabase = await createClient();
  try {
    // Verificar se o usuário é admin
    await getAuthenticatedAdminId();
    
    // Buscar post com suas categorias associadas (sem !inner para permitir posts sem categorias)
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select(`
        id, titulo, slug, resumo, conteudo, imagem_destaque_url, author_id, 
        is_published, published_at, created_at, updated_at, like_count, view_count,
        blog_post_categories(
          category_id,
          blog_categories(id, nome)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!post) return null;

    // Buscar informações do autor se existir
    let userProfileData: UserProfileInfo | null = null;
    if (post.author_id) {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('nome, sobrenome')
        .eq('user_id', post.author_id)
        .single();
      
      if (profileError) {
        console.error(`Erro ao buscar perfil do autor ${post.author_id} para o post ${id}:`, profileError.message);
      } else {
        userProfileData = profile;
      }
    }
    
    // Processamento das categorias para o formulário de edição
    const categoryIds: string[] = [];
    
    if (post.blog_post_categories && Array.isArray(post.blog_post_categories)) {
      for (const pc of post.blog_post_categories) {
        // Usar tipo any para evitar erros de tipagem
        const catInfo: any = pc;
        
        // Verificar se temos dados completos da categoria
        if (catInfo.blog_categories && typeof catInfo.blog_categories === 'object' && !Array.isArray(catInfo.blog_categories)) {
          categoryIds.push(catInfo.blog_categories.id);
        } 
        // Fallback para caso tenhamos apenas o category_id
        else if (catInfo.category_id) {
          categoryIds.push(catInfo.category_id);
        }
      }
    }
    
    // Remove blog_post_categories do objeto post pois já processamos essa informação
    const { blog_post_categories, ...restOfPost } = post;

    return { 
      ...restOfPost, 
      like_count: post.like_count ?? 0,
      view_count: post.view_count ?? 0,
      user_profiles: userProfileData, // Anexa os dados do perfil buscados
      categorias: categoryIds // IDs das categorias para uso no formulário
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

    // Buscar posts com suas categorias (sem o !inner para permitir posts sem categorias)
    const { data: postsData, error: postsError } = await supabase
      .from('blog_posts')
      .select(`
        id, titulo, slug, resumo, conteudo, imagem_destaque_url, author_id, 
        is_published, published_at, created_at, updated_at, like_count, view_count,
        blog_post_categories ( 
          category_id,
          blog_categories ( id, nome )
        )
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
    
    // Processar os posts
    const result: BlogPostFromDB[] = [];
    
    for (const post of postsData) {
      // Extrair as categorias e seus IDs
      const categoryIds: string[] = [];
      let postCategories: any[] = [];
      
      if (post.blog_post_categories && Array.isArray(post.blog_post_categories)) {
        postCategories = post.blog_post_categories;
        
        // Extrair IDs para o formulário
        for (const pc of post.blog_post_categories) {
          // Usar tipo any para evitar erros de tipagem
          const catInfo: any = pc;
          
          if (catInfo && catInfo.blog_categories && typeof catInfo.blog_categories === 'object' && !Array.isArray(catInfo.blog_categories)) {
            categoryIds.push(catInfo.blog_categories.id);
          }
        }
      }
      
      // Criar o objeto com tipagem compatível
      result.push({
        id: post.id,
        titulo: post.titulo,
        slug: post.slug,
        resumo: post.resumo,
        conteudo: post.conteudo || '',
        imagem_destaque_url: post.imagem_destaque_url,
        author_id: post.author_id,
        is_published: post.is_published || false,
        published_at: post.published_at,
        created_at: post.created_at,
        updated_at: post.updated_at,
        like_count: post.like_count ?? 0,
        view_count: post.view_count ?? 0,
        user_profiles: post.author_id ? userProfilesMap.get(post.author_id) || null : null,
        // Preservar o formato original para a exibição correta na UI
        blog_post_categories: postCategories,
        // Lista de IDs para uso no formulário
        categorias: categoryIds
      });
    }
    
    return result;
    
  } catch (error: any) {
    console.error("Exceção ao buscar posts para admin:", error.message);
    return [];
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