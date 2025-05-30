-- Garantir que as 4 categorias principais existem
INSERT INTO public.categories (nome, slug, descricao, imagem_url, is_active)
VALUES 
    ('Brinquedos Sensoriais', 'brinquedos-sensoriais', 'Brinquedos para estimulação sensorial', 'https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/loja/categorias-inicio/brinquedoSensoriais.png', true),
    ('PECS', 'pecs', 'Picture Exchange Communication System', 'https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/loja/categorias-inicio/pecs.png', true),
    ('Material Pedagógico', 'material-pedagogico', 'Materiais educacionais e pedagógicos', 'https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/loja/categorias-inicio/materialPedagogico.png', true),
    ('E-books', 'e-books', 'Livros digitais educacionais', 'https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/loja/categorias-inicio/ebook.png', true)
ON CONFLICT (nome) DO UPDATE
SET 
    imagem_url = EXCLUDED.imagem_url,
    is_active = true;

-- Atualizar ordem de exibição (se a coluna existir)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'ordem_exibicao') THEN
        UPDATE public.categories SET ordem_exibicao = 1 WHERE nome = 'Brinquedos Sensoriais';
        UPDATE public.categories SET ordem_exibicao = 2 WHERE nome = 'PECS';
        UPDATE public.categories SET ordem_exibicao = 3 WHERE nome = 'Material Pedagógico';
        UPDATE public.categories SET ordem_exibicao = 4 WHERE nome = 'E-books';
    END IF;
END $$;