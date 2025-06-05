-- Habilitar RLS na tabela blog_post_saves
ALTER TABLE public.blog_post_saves ENABLE ROW LEVEL SECURITY;

-- Política para SELECT: Usuários podem ver apenas seus próprios posts salvos
CREATE POLICY "Usuários podem ver seus próprios posts salvos" 
ON public.blog_post_saves
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Política para INSERT: Usuários podem salvar posts (apenas para si mesmos)
CREATE POLICY "Usuários podem salvar posts" 
ON public.blog_post_saves
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Política para DELETE: Usuários podem remover seus próprios posts salvos
CREATE POLICY "Usuários podem remover seus posts salvos" 
ON public.blog_post_saves
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_blog_post_saves_post_id ON public.blog_post_saves USING btree (post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_saves_user_id ON public.blog_post_saves USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_saves_user_post ON public.blog_post_saves USING btree (user_id, post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_saves_user_created ON public.blog_post_saves USING btree (user_id, created_at DESC);

-- Política adicional para administradores (opcional)
-- Permite que administradores vejam todos os posts salvos
CREATE POLICY "Administradores podem ver todos os posts salvos" 
ON public.blog_post_saves
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.role = 'admin'
  )
);

-- Comentário na tabela para documentação
COMMENT ON TABLE public.blog_post_saves IS 'Tabela para armazenar posts do blog salvos pelos usuários (favoritos/bookmarks)';
COMMENT ON COLUMN public.blog_post_saves.post_id IS 'ID do post salvo';
COMMENT ON COLUMN public.blog_post_saves.user_id IS 'ID do usuário que salvou o post';
COMMENT ON COLUMN public.blog_post_saves.created_at IS 'Data e hora em que o post foi salvo';