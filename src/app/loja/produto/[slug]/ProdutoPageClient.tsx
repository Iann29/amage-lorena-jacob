'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getRelatedProducts, mockReviews, type Product } from '@/lib/mockDataLoja';
import { ProductCard } from '@/components/loja/ProductCard';
import { useUser } from '@/hooks/useUser';
import { motion, AnimatePresence } from 'framer-motion';

interface ProdutoPageClientProps {
  product: Product;
}

export default function ProdutoPageClient({ product }: ProdutoPageClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const { user } = useUser();

  const relatedProducts = getRelatedProducts(product.id, 3);
  const productReviews = mockReviews.filter(r => r.product_id === product.id);
  const price = product.preco_promocional || product.preco;
  const hasDiscount = !!product.preco_promocional;

  const handleAddToCart = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    console.log('Adicionando ao carrinho:', { product, quantity });
    // TODO: Implementar lógica real do carrinho
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li><Link href="/loja" className="hover:text-[#5179C8]">Produtos</Link></li>
            <li>{'>'}</li>
            <li><Link href={`/loja/${product.category?.slug}`} className="hover:text-[#5179C8]">{product.category?.nome}</Link></li>
            <li>{'>'}</li>
            <li className="font-bold" style={{ color: '#2A289B' }}>{product.nome}</li>
          </ol>
        </nav>

        {/* Container com fundo branco */}
        <div className="bg-white rounded-3xl p-8 mb-12 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
            {/* Galeria de Imagens */}
            <div className="relative">
            <div className="relative h-[500px] bg-white rounded-lg overflow-hidden">
              <Image
                src={product.imagens[selectedImage]?.image_url || '/placeholder.jpg'}
                alt={product.nome}
                fill
                className="object-contain"
              />
            </div>

            {/* Miniaturas */}
            {product.imagens.length > 1 && (
              <div className="flex gap-2 mt-4">
                {product.imagens.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded border-2 overflow-hidden ${
                      selectedImage === index ? 'border-[#5179C8]' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={img.image_url}
                      alt={`${product.nome} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações do Produto */}
          <div className="relative">
            {/* Botão Voltar */}
            <Link 
              href="/loja/produtos"
              className="absolute -top-20 right-0 inline-flex items-center gap-1 px-3 py-1.5 rounded text-sm text-white transition-colors z-10"
              style={{ backgroundColor: '#8B6F47' }}
            >
              <span className="text-lg">←</span> Voltar
            </Link>
            
            <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-20 relative" style={{ border: '2px solid #000' }}>
              {/* Botão de Like */}
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Adicionar aos favoritos"
              >
                <Image
                  src={isLiked ? "/assets/like.png" : "/assets/likeVazio.png"}
                  alt="Favoritar"
                  width={24}
                  height={24}
                  className="transition-transform hover:scale-110"
                />
              </button>
              <h1 
                className="text-4xl font-bold mb-4 pr-12"
                style={{ color: '#76A3C3', fontFamily: 'var(--font-museo-sans)' }}
              >
                {product.nome}
              </h1>

              {/* Preços */}
              <div className="mb-4">
                {hasDiscount && (
                  <span className="text-gray-400 line-through text-lg mr-2">
                    R$ {product.preco.toFixed(2).replace('.', ',')}
                  </span>
                )}
                <span className="text-3xl font-bold text-black">
                  R$ {price.toFixed(2).replace('.', ',')}
                </span>
              </div>

              {/* Avaliações */}
              {product.rating_avg && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-xl ${i < Math.round(product.rating_avg!) ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-600">({product.review_count} avaliações)</span>
                </div>
              )}

              <Link 
                href="#descricao" 
                className="text-[#5179C8] underline mb-4 inline-block"
              >
                Ver Descrição
              </Link>

              {/* Status do estoque */}
              <div className="mb-6">
                <span className="text-sm text-gray-600">Estoque Disponível</span>
                <p className="text-green-600 font-medium">
                  {product.quantidade_estoque > 0 ? `${product.quantidade_estoque} unidades` : 'Indisponível'}
                </p>
              </div>

              {/* Quantidade */}
              <div className="mb-6">
                <label className="block text-sm font-bold mb-2 text-black">Quantidade:</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded border-2 border-black text-black font-bold flex items-center justify-center hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 h-10 text-center border-2 border-black text-black font-bold rounded"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded border-2 border-black text-black font-bold flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 text-white font-medium rounded transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{ backgroundColor: '#5179C8' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4169B8'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#5179C8'}
                  disabled={product.quantidade_estoque === 0}
                >
                  Comprar Agora
                </button>
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 text-white font-medium rounded transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#4CAF50' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45A049'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
                  disabled={product.quantidade_estoque === 0}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" fill="white"/>
                    <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" fill="white"/>
                    <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Descrição */}
        <section id="descricao" className="bg-white rounded-3xl p-8 mb-12 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-black">Descrição</h2>
          <div className={`prose max-w-none ${!showFullDescription ? 'line-clamp-4' : ''}`}>
            <p className="text-black whitespace-pre-line">{product.descricao}</p>
          </div>
          {product.descricao.length > 200 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-[#5179C8] underline mt-2"
            >
              {showFullDescription ? 'Ver menos' : 'Ver mais'}
            </button>
          )}

          {/* Características com checkmarks */}
          <div className="mt-6 space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-xl">✓</span>
              <span className="text-black">Modelos de rotina prontos para diferentes idades</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-xl">✓</span>
              <span className="text-black">Sugestões de atividades educativas e recreativas</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-xl">✓</span>
              <span className="text-black">Orientações para lidar com a resistência das crianças</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-xl">✓</span>
              <span className="text-black">Dicas de temporização e adaptação para cada família</span>
            </div>
          </div>
        </section>
        
      </div>
      
      {/* Produtos Relacionados - Fora do container para cobrir toda a largura */}
      {relatedProducts.length > 0 && (
        <section className="bg-white w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] py-8 mb-12 shadow-lg">
            <div className="container mx-auto px-4">
            <h2 
              className="text-3xl font-bold mb-6"
              style={{ 
                color: '#6FB1CE',
                fontFamily: 'var(--font-museo-sans)'
              }}
            >
              + da mesma categoria
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <Link 
                  key={relatedProduct.id}
                  href={`/loja/produto/${relatedProduct.slug}`}
                  className="group"
                >
                  <div className="bg-gray-50 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="relative h-48 mb-3 overflow-hidden rounded-xl">
                      <Image
                        src={relatedProduct.imagens[0]?.image_url || '/placeholder.jpg'}
                        alt={relatedProduct.nome}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-bold text-sm mb-2 line-clamp-2 text-black group-hover:text-[#5179C8] transition-colors" style={{ fontFamily: 'var(--font-museo-sans)' }}>
                      {relatedProduct.nome}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      {relatedProduct.preco_promocional && (
                        <span className="text-xs text-gray-400 line-through">
                          R$ {relatedProduct.preco.toFixed(2).replace('.', ',')}
                        </span>
                      )}
                      <span className="text-lg font-bold text-[#5179C8]">
                        R$ {(relatedProduct.preco_promocional || relatedProduct.preco).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            </div>
          </section>
        )}

        {/* Avaliações */}
        <div className="container mx-auto px-4 pb-8">
        <section className="bg-white rounded-3xl p-8 mb-12 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-black" style={{ fontFamily: 'var(--font-museo-sans)' }}>Avaliações</h2>
          
          {/* Resumo das avaliações */}
          {product.rating_avg && (
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-black" style={{ fontFamily: 'var(--font-museo-sans)' }}>
                    {product.rating_avg.toFixed(1)}
                  </div>
                  <div className="flex justify-center my-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-2xl ${i < Math.round(product.rating_avg!) ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-black font-medium">{product.review_count} avaliações</div>
                </div>
                
                {/* Barra de progresso por estrelas */}
                <div className="flex-1 w-full md:w-auto">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = productReviews.filter(r => r.rating === stars).length;
                    const percentage = product.review_count ? (count / product.review_count) * 100 : 0;
                    return (
                      <div key={stars} className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-black w-12">{stars} ★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-yellow-400 h-full rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Lista de comentários */}
          <div className="space-y-4">
            {productReviews.length > 0 ? (
              productReviews.map((review) => (
                <div key={review.id} className="bg-gray-50 p-6 rounded-2xl">
                  <div className="flex items-start gap-4">
                    <Image
                      src={review.user_avatar || '/assets/avatar-default.png'}
                      alt={review.user_name}
                      width={48}
                      height={48}
                      className="rounded-full border-2 border-white shadow-sm"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-black" style={{ fontFamily: 'var(--font-museo-sans)' }}>
                            {review.user_name}
                          </h4>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(review.created_at).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-black leading-relaxed">{review.comentario}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>
              </div>
            )}
          </div>
          
          {/* Botão para avaliar (se usuário comprou o produto) */}
          <div className="mt-8 text-center">
            <button 
              onClick={() => {
                if (!user) {
                  setShowLoginModal(true);
                  return;
                }
                // TODO: Implementar lógica de avaliação
              }}
              className="px-6 py-3 rounded-full text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: '#5179C8', fontFamily: 'var(--font-museo-sans)' }}
            >
              Avaliar Produto
            </button>
          </div>
        </section>
        </div>
        
        {/* Modal de Login */}
        <AnimatePresence>
          {showLoginModal && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowLoginModal(false)}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
              />
              
              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", duration: 0.3 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-md px-4"
              >
                <div className="bg-white rounded-3xl shadow-2xl w-full p-8 relative">
                  {/* Botão Fechar */}
                  <button
                    onClick={() => setShowLoginModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  
                  {/* Ícone do Carrinho */}
                  <div className="flex justify-center mb-6">
                    <div className="bg-[#E3F2FD] rounded-full p-6">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" fill="#5179C8"/>
                        <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" fill="#5179C8"/>
                        <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="#5179C8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Título */}
                  <h2 className="text-2xl font-bold text-center mb-3" style={{ color: '#2A289B', fontFamily: 'var(--font-museo-sans)' }}>
                    Faça login para continuar
                  </h2>
                  
                  {/* Descrição */}
                  <p className="text-gray-600 text-center mb-8" style={{ fontFamily: 'var(--font-museo-sans)' }}>
                    Para adicionar produtos ao carrinho, você precisa estar conectado à sua conta.
                  </p>
                  
                  {/* Botões */}
                  <div className="space-y-3">
                    <Link
                      href="/login"
                      className="w-full bg-[#5179C8] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#4169B8] transition-colors flex items-center justify-center gap-2"
                      style={{ fontFamily: 'var(--font-museo-sans)' }}
                    >
                      <Image src="/assets/perfilIcon.png" alt="Login" width={20} height={20} className="brightness-0 invert" />
                      Fazer Login
                    </Link>
                    
                    <Link
                      href="/cadastro"
                      className="w-full bg-white text-[#5179C8] border-2 border-[#5179C8] py-3 px-6 rounded-lg font-medium hover:bg-[#5179C8] hover:text-white transition-colors flex items-center justify-center"
                      style={{ fontFamily: 'var(--font-museo-sans)' }}
                    >
                      Criar Conta
                    </Link>
                  </div>
                  
                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">ou</span>
                    </div>
                  </div>
                  
                  {/* Login com Google */}
                  <Link
                    href="/login"
                    className="w-full bg-white text-gray-800 border border-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
                  >
                    <Image src="/assets/google.svg" alt="Google" width={20} height={20} />
                    Entrar com Google
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
    </div>
  );
}