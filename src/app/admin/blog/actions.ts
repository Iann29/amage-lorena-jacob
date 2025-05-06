// src/app/admin/blog/actions.ts
"use server";

import { createClient } from '@/utils/supabase/server'; // <<< USA O CLIENTE DO SERVIDOR
import { revalidatePath } from 'next/cache';
// Tentativa correta para JSDOM em ambiente Node.js
import { JSDOM } from 'jsdom'; // Importação padrão
import DOMPurifyServer from 'dompurify';

const windowInstance = new JSDOM('').window; // Cria a instância da window do JSDOM
const purify = DOMPurifyServer(windowInstance as unknown as Window); // Cast para Window se necessário

interface PostFormData {
  titulo: string;
  slug: string;
  resumo: string;
  conteudo: string;
  categorias: string[];
  imagem_destaque_url?: string;
  is_published?: boolean;
}

async function getAuthenticatedAdmin() {
  const supabase = await createClient(); // Usa o cliente do servidor
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
  return user;
}

export async function createPost(formData: PostFormData) {
  const supabase = await createClient(); // Usa o cliente do servidor
  try {
    const adminUser = await getAuthenticatedAdmin();
    const author_id = adminUser.id;

    const sanitizedContent = purify.sanitize(formData.conteudo, {
      USE_PROFILES: { html: true },
    });

    const { data: postData, error: postError } = await supabase
      .from('blog_posts')
      .insert([ /* ... seu objeto de inserção ... */ 
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
      .select()
      .single();

    if (postError) throw postError;
    if (!postData) throw new Error("Falha ao criar o post.");

    if (formData.categorias && formData.categorias.length > 0) {
      const postCategories = formData.categorias.map(catId => ({
        post_id: postData.id,
        category_id: catId,
      }));
      await supabase.from('blog_post_categories').insert(postCategories);
    }

    revalidatePath('/admin/blog');
    revalidatePath(`/blog/${formData.slug}`);
    return { success: true, message: "Post criado com sucesso!", postId: postData.id };
  } catch (error: any) {
    return { success: false, message: error.message || "Falha ao criar post." };
  }
}

export async function updatePost(postId: string, formData: PostFormData) {
  const supabase = await createClient(); // Usa o cliente do servidor
  try {
    const adminUser = await getAuthenticatedAdmin();
    const sanitizedContent = purify.sanitize(formData.conteudo, { USE_PROFILES: { html: true } });

    const { data, error: postError } = await supabase
      .from('blog_posts')
      .update({ /* ... seu objeto de atualização ... */
        titulo: formData.titulo,
        slug: formData.slug,
        resumo: formData.resumo,
        conteudo: sanitizedContent,
        imagem_destaque_url: formData.imagem_destaque_url || null,
        updated_at: new Date().toISOString(),
        is_published: formData.is_published === undefined ? false : formData.is_published,
      })
      .eq('id', postId)
      .select()
      .single();

    if (postError) throw postError;
    if (!data) throw new Error("Falha ao atualizar o post.");

    await supabase.from('blog_post_categories').delete().eq('post_id', postId);
    if (formData.categorias && formData.categorias.length > 0) {
      const postCategories = formData.categorias.map(catId => ({
        post_id: postId,
        category_id: catId,
      }));
      await supabase.from('blog_post_categories').insert(postCategories);
    }

    revalidatePath('/admin/blog');
    revalidatePath(`/blog/${formData.slug}`);
    revalidatePath(`/admin/blog/editar/${postId}`);
    return { success: true, message: "Post atualizado com sucesso!", post: data };
  } catch (error: any) {
    return { success: false, message: error.message || "Falha ao atualizar post." };
  }
}

export async function getPostForEdit(id: string) {
  const supabase = await createClient(); // Usa o cliente do servidor
  try {
    await getAuthenticatedAdmin();
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select("*, blog_post_categories(category_id)")
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!post) return null;
    
    const categories = post.blog_post_categories ? (post.blog_post_categories as any[]).map(pc => pc.category_id) : [];
    return { ...post, categorias: categories as string[] };
  } catch (error: any) {
    return null;
  }
}

export async function getBlogCategories() {
  const supabase = await createClient(); // Usa o cliente do servidor
  try {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('id, nome')
      .order('nome', { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    return [];
  }
}