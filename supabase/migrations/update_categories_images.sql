-- Atualizar imagens das categorias
UPDATE public.categories
SET imagem_url = CASE 
    WHEN nome = 'Brinquedos Sensoriais' THEN 'https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/loja/categorias-inicio/brinquedoSensoriais.png'
    WHEN nome = 'PECS' THEN 'https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/loja/categorias-inicio/pecs.png'
    WHEN nome = 'Material Pedagógico' THEN 'https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/loja/categorias-inicio/materialPedagogico.png'
    WHEN nome = 'E-books' THEN 'https://vqldbbetnfhzealxumcl.supabase.co/storage/v1/object/public/lorena-images-db/loja/categorias-inicio/ebook.png'
    ELSE imagem_url
END
WHERE nome IN ('Brinquedos Sensoriais', 'PECS', 'Material Pedagógico', 'E-books');