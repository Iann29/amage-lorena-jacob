# Plano de Ação - Implementação da Loja Virtual

## 📋 Visão Geral
Implementação completa de uma loja virtual integrada ao site existente, mantendo a identidade visual e reutilizando componentes quando possível.

## 🎨 Diretrizes de Design

### Cores Principais
- **Azul Principal**: #5179C8
- **Azul Escuro (títulos)**: #2A289B
- **Azul Claro (subtítulos)**: #7877D0
- **Azul Produto**: #76A3C3
- **Amarelo (destaques)**: #F9FFD6
- **Verde (carrinho)**: #4CAF50
- **Cinza Backgrounds**: #F5F5F5

### Tipografia
- Fonte principal: Museo Sans (já configurada no projeto)
- Títulos grandes: Bold
- Preços promocionais: Bold
- Texto normal: Regular

## 🏗️ Estrutura de Componentes

### 1. Layout da Loja
```
/src/app/loja/
├── page.tsx                    # Página principal da loja
├── layout.tsx                  # Layout específico da loja
├── [categoria]/
│   └── page.tsx               # Listagem por categoria
├── produto/
│   └── [slug]/
│       └── page.tsx           # Página individual do produto
├── carrinho/
│   └── page.tsx               # Carrinho de compras
└── checkout/
    └── page.tsx               # Finalização de compra
```

### 2. Componentes Necessários

#### Componentes Principais
- `BannerCarousel` - Carrossel de banners promocionais
- `CategoryCards` - Cards de categorias principais
- `BenefitsSection` - Seção de benefícios (frete, parcelamento, etc)
- `ProductCard` - Card de produto reutilizável
- `ProductGrid` - Grid responsivo de produtos
- `FilterSidebar` - Barra lateral de filtros
- `SearchBar` - Barra de pesquisa de produtos

#### Componentes de Produto
- `ProductGallery` - Galeria de imagens do produto
- `ProductInfo` - Informações e ações do produto
- `ProductReviews` - Sistema de avaliações (reutilizar do blog)
- `RelatedProducts` - Produtos relacionados

#### Componentes do Carrinho
- `CartItem` - Item individual no carrinho
- `CartSummary` - Resumo do carrinho
- `ShippingCalculator` - Calculadora de frete

#### Componentes Compartilhados
- `LikeButton` - Botão de favoritar (reutilizar do blog)
- `StarRating` - Componente de avaliação por estrelas
- `Breadcrumb` - Navegação estrutural

## 📊 Estrutura de Dados (Mock)

### Produto
```typescript
interface Product {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  preco: number;
  preco_promocional?: number;
  categoria: Category;
  imagens: ProductImage[];
  estoque: number;
  idade_min?: number;
  idade_max?: number;
  avaliacoes: Review[];
  tags: string[];
}
```

### Categoria
```typescript
interface Category {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  imagem_url: string;
  produtos_count: number;
}
```

## 🚀 Fases de Implementação

### Fase 1: Estrutura Base e Página Principal
1. ✅ Criar estrutura de pastas
2. ✅ Implementar layout da loja
3. ✅ Criar página principal com:
   - Banner carrossel
   - Cards de categorias
   - Seção de benefícios
   - Produtos em destaque

### Fase 2: Listagem e Filtros
1. Implementar grid de produtos
2. Criar sistema de filtros (categoria, preço, idade)
3. Implementar busca
4. Adicionar paginação/"Ver mais"

### Fase 3: Página de Produto
1. Criar página individual do produto
2. Implementar galeria de imagens
3. Adicionar informações do produto
4. Integrar sistema de avaliações

### Fase 4: Carrinho e Checkout
1. Implementar carrinho de compras
2. Criar calculadora de frete
3. Desenvolver fluxo de checkout
4. Integrar com sistema de pagamento (futuro)

### Fase 5: Funcionalidades Adicionais
1. Sistema de favoritos
2. Histórico de pedidos
3. Notificações
4. Cupons de desconto

## 🔧 Considerações Técnicas

### Reutilização de Componentes
- Sistema de comentários/avaliações do blog
- Componente de like/favorito
- Paginação
- Modais

### Estado Global
- Carrinho de compras (Context API ou Zustand)
- Favoritos do usuário
- Filtros ativos

### Performance
- Lazy loading de imagens
- Virtualização para listas grandes
- Cache de produtos visualizados
- Otimização de bundle

### SEO
- Metadados dinâmicos por produto
- Structured data para produtos
- URLs amigáveis
- Sitemap atualizado

## 📱 Responsividade
- Mobile-first approach
- Grid adaptativo (1-2-3 colunas)
- Menu hambúrguer com carrinho
- Filtros em drawer no mobile
- Touch-friendly em elementos interativos

## 🔒 Segurança
- Validação de entrada de dados
- Sanitização de conteúdo
- Proteção contra XSS
- Rate limiting em APIs
- Autenticação para compras

## 📈 Próximos Passos

1. **Imediato**: Criar mock data para desenvolvimento
2. **Curto prazo**: Implementar componentes base da loja
3. **Médio prazo**: Integrar com Supabase
4. **Longo prazo**: Implementar pagamento e logística

## 🎯 Métricas de Sucesso
- Tempo de carregamento < 3s
- Taxa de conversão > 2%
- Abandono de carrinho < 70%
- Avaliação média > 4.5 estrelas
- Mobile-friendly score > 95

---

Este plano será atualizado conforme o desenvolvimento progride e novos requisitos surgirem.