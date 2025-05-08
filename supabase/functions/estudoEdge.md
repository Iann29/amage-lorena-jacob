# Estudo de Caso – Migração das Funções de Backend do Blog para Supabase Edge Functions

## 1. Contexto Atual
O projeto **Lorena Jacob** utiliza *Next.js 15 (App Router)* no front-end e Supabase como backend. As operações de leitura de dados do blog (listar posts, buscar post por _slug_, categorias, posts populares) ocorrem hoje através de _Server Actions_ em `src/app/blog/actions.ts`.

```txt
Front-End  ─┬─►  actions.ts  (server)  ───►  Supabase DB (RLS)
            └─►  Gerenciamento admin (actions em src/app/admin/blog)
```

Embora funcione, este modelo cria acoplamento forte entre **deploy de Front-End** e **código de backend**, expõe lógica de negócio dentro da aplicação React e não aproveita os benefícios de execução na borda.

---
## 2. Objetivos da Migração
| Objetivo | Motivação |
|----------|-----------|
| **Desempenho Global** | Executar próximas ao usuário, reduzindo latência (SEO/UX). |
| **Segurança** | Isolar lógica de negócio; manter chaves secretas fora do bundle do FE. |
| **Escalabilidade** | Edge Functions escalam sob demanda sem sobrecarregar o server Next.js. |
| **Manutenibilidade** | Separar claramente responsabilidades FE/BE; deploy independente. |
| **Reutilização** | As mesmas rotas podem ser consumidas pelo site, admin e futuros serviços (mobile, API externa). |

---
## 3. Requisitos Funcionais a Migrar
| Rota                   | Método | Descrição |
|------------------------|--------|-----------|
| `/blog/posts`          | GET    | Lista posts publicados com paginação/filtro. |
| `/blog/posts/:slug`    | GET    | Retorna post público por _slug_. |
| `/blog/categories`     | GET    | Lista categorias públicas. |
| `/blog/popular`        | GET    | Retorna _N_ posts mais populares. *Query*: `limit=` |
| `/admin/blog/posts`    | GET    | (restrito) Lista todos posts para painel admin. |
| `/admin/blog/posts/:id`| PUT    | Atualiza um post (painel admin). |
| `/admin/blog/posts/:id`| DELETE | Exclui post. |

> Somente as rotas **públicas** estão no escopo imediato; rotas admin podem migrar depois.

---
## 4. Arquitetura Proposta
```
                                                   ┌──────────────┐
                     supabase.auth (JWT) ────►     │ RLS Policies │
                                                   └──────────────┘
           ┌───────────────┐  fetch  ┌─────────────────────┐
Browser ─► │ Next.js (FE)  │ ───────► │ Edge Function (Deno)│
           └───────────────┘         └─────────────────────┘
                                            │  RPC        
                                            ▼
                                    Supabase Postgres DB
```
- **Edge Function** escrita em TypeScript (Deno runtime).
- Utiliza o *helper* `createClient` do Supabase com `SUPABASE_SERVICE_ROLE_KEY` restrito ao backend.
- Respeita as mesmas RLS policies; para consultas públicas basta role `anon`.
- Respostas **JSON** padronizadas: `{ data, error }`.

---
## 5. Design das Edge Functions
### Organização de pastas
```
supabase/functions/
├── blog-posts/           # /blog/posts           (GET)
│   └── index.ts
├── blog-post/            # /blog/posts/:slug     (GET)
│   └── [slug].ts
├── blog-categories/      # /blog/categories      (GET)
│   └── index.ts
├── blog-popular/         # /blog/popular         (GET)
│   └── index.ts
└── util/                 # helpers compartilhados (schema, error)
```

### Exemplos de boas práticas a aplicar
| Boas Práticas | Ação |
|---------------|------|
| **Validação de Entrada** | Utilizar `zod` para validar `slug`, `limit`. |
| **Headers HTTP** | `Cache-Control: public, max-age=60, s-maxage=600, stale-while-revalidate=300` para GETs públicos. |
| **CORS** | Permitir domínios front (`NEXT_PUBLIC_SITE_URL`). |
| **Rate Limiting** | Implementar contador por IP em `@supabase/edge-runtime`. |
| **Pegada de log** | `console.log` somente no nível `debug`; erros via `console.error`. |
| **Estrutura de resposta** | `{ success: boolean; data?: T; error?: { code:string; message:string } }`. |

---
## 6. Segurança
1. **Segredos:** `
   - `SUPABASE_URL` & `SUPABASE_SERVICE_ROLE_KEY` injetados como variáveis de ambiente no Edge Runtime.
   - Nunca expor `service_role` no FE.
2. **RLS:**
   - Posts públicos: policy `is_published = true` já aplicada.
3. **Autorização Admin (futuro):**
   - Verificar JWT e checar `role = 'admin'` ou claim custom `is_admin=true`.
4. **Rate Limit** 100 req/10 min por IP (Cloudflare KV ou `Deno KV`).
5. **Validar Saída** para prevenir XSS (conteúdo já armazenado como HTML sanitizado).

---
## 7. Passos de Migração
1. **Criar funções** nos caminhos acima (Deno).  
2. **Copiar lógica** de `actions.ts`, ajustando `createClient` e removendo código desnecessário.
3. **Testar localmente** com `supabase functions serve --env-file .env.local`.
4. **Atualizar front-end**: substituir chamadas às _Server Actions_ por `fetch('/functions/v1/blog-posts')` ou `supabase.functions.invoke()`.
5. **Remover ações antigas** somente após validação.
6. **CI/CD:** adicionar step `supabase functions deploy` no workflow GitHub Actions.

---
## 8. Testes e Observabilidade
- **Unitários**: mock de Supabase client usando `supabase-js`.
- **E2E**: Cypress chama rotas Edge.
- **Logs**: habilitar export para Supabase Logflare.

---
## 9. Riscos & Mitigações
| Risco                              | Mitigação |
|------------------------------------|-----------|
| Latência ocasional na borda        | Ajustar cache & fallback. |
| Incompatibilidade Deno/Node libs   | Usar libs compatíveis (`std`, `zod`). |
| Regressão funcional após migração  | Testes automatizados & deploy canário. |
| Rate limit falso-positivo          | Permitir whitelist para IP internos. |

---
## 10. Conclusão
Migrar as funções do blog para Supabase Edge Functions traz **ganhos claros** em desempenho, segurança e escalabilidade, além de alinhar-se às regras globais deste projeto. A implementação proposta mantém isolamento de segredos, segue boas práticas de API e prepara o sistema para crescimento futuro.

> **Próximos passos:** iniciar protótipo da rota `/blog/posts`, validar métricas de latência e ajustar cache.
