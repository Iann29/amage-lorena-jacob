# 🔧 Correção do Erro de Endereços - Explicação

## ❌ Erro Encontrado
```
GET https://vqldbbetnfhzealxumcl.supabase.co/rest/v1/user_addresses 404 (Not Found)
Error: relation "public.user_addresses" does not exist
```

## ✅ Causa do Problema
O código estava tentando acessar a tabela `user_addresses`, mas no banco de dados Supabase a tabela se chama `shipping_addresses`.

## 🛠️ Correção Aplicada
Foi corrigido o nome da tabela em todo o código de `user_addresses` para `shipping_addresses`.

## 📋 Verificações no Supabase

### 1. Verificar se a tabela existe:
1. Acesse o **Supabase Dashboard**
2. Vá em **Table Editor**
3. Procure pela tabela `shipping_addresses`
4. Se não existir, execute o SQL de criação fornecido anteriormente

### 2. Verificar as políticas RLS:
1. No Supabase, vá em **Authentication > Policies**
2. Encontre a tabela `shipping_addresses`
3. Verifique se existem as seguintes políticas:
   - `users_view_own_addresses` (SELECT)
   - `users_insert_own_addresses` (INSERT)
   - `users_update_own_addresses` (UPDATE)
   - `users_delete_own_addresses` (DELETE)

### 3. Se as políticas não existirem:
Execute o arquivo `shipping-addresses-policies.sql` no SQL Editor do Supabase.

### 4. Verificar se RLS está habilitado:
```sql
-- No SQL Editor, execute:
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'shipping_addresses';
```
- Se `rowsecurity` = false, execute:
```sql
ALTER TABLE public.shipping_addresses ENABLE ROW LEVEL SECURITY;
```

### 5. Testar acesso:
```sql
-- Teste se consegue inserir um endereço
INSERT INTO public.shipping_addresses (
    user_id,
    nome_destinatario,
    rua,
    numero,
    bairro,
    cidade,
    estado,
    cep
) VALUES (
    auth.uid(), -- Usa o ID do usuário atual
    'Teste',
    'Rua Teste',
    '123',
    'Centro',
    'São Paulo',
    'SP',
    '01234-567'
);
```

## 🚀 Status Atual
- ✅ Código corrigido para usar `shipping_addresses`
- ✅ Políticas RLS criadas no arquivo SQL
- ⏳ Aguardando execução das políticas no Supabase

## 📝 Próximos Passos
1. Execute o arquivo `shipping-addresses-policies.sql` no Supabase
2. Verifique se a tabela `shipping_addresses` existe
3. Teste a funcionalidade de endereços na aplicação