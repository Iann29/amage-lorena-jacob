'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { mockProducts } from '@/lib/mockDataLoja';

interface CartItem {
  product: typeof mockProducts[0];
  quantity: number;
}

export default function CarrinhoPage() {
  // Por enquanto, usando dados mockados
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: mockProducts[0], quantity: 1 },
    { product: mockProducts[1], quantity: 2 },
  ]);
  const [cep, setCep] = useState('');
  const [frete, setFrete] = useState<number | null>(null);

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems(prev => prev.filter(item => item.product.id !== productId));
    } else {
      setCartItems(prev => prev.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const removeItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.preco_promocional || item.product.preco;
      return total + (price * item.quantity);
    }, 0);
  };

  const calculateFrete = () => {
    if (!cep) return;
    // Simulação de cálculo de frete
    setFrete(15.90);
  };

  const subtotal = calculateSubtotal();
  const total = subtotal + (frete || 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Image
            src="/assets/loja/carrinhoHeader.png"
            alt="Carrinho vazio"
            width={100}
            height={100}
            className="mx-auto mb-4 opacity-50"
          />
          <h2 className="text-2xl font-bold mb-2 text-black">Seu carrinho está vazio</h2>
          <p className="text-black mb-4">Adicione produtos para continuar</p>
          <Link
            href="/loja"
            className="inline-block px-6 py-3 rounded-md text-white font-medium"
            style={{ backgroundColor: '#5179C8' }}
          >
            Continuar Comprando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 
          className="text-3xl font-bold mb-8"
          style={{ color: '#2A289B', fontFamily: 'var(--font-museo-sans)' }}
        >
          Meu Carrinho
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Produtos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {cartItems.map((item) => {
                const price = item.product.preco_promocional || item.product.preco;
                return (
                  <div key={item.product.id} className="flex items-center gap-4 py-4 border-b last:border-0">
                    {/* Imagem */}
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.product.imagens[0]?.image_url || '/placeholder.jpg'}
                        alt={item.product.nome}
                        fill
                        className="object-contain rounded"
                      />
                    </div>

                    {/* Informações */}
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-1 text-black">{item.product.nome}</h3>
                      <p className="text-black text-sm">
                        R$ {price.toFixed(2).replace('.', ',')} cada
                      </p>
                    </div>

                    {/* Quantidade */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 rounded border-2 border-black text-black font-bold flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-12 text-center text-black font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 rounded border-2 border-black text-black font-bold flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Preço total */}
                    <div className="text-right min-w-[100px]">
                      <p className="font-bold text-lg text-black">
                        R$ {(price * item.quantity).toFixed(2).replace('.', ',')}
                      </p>
                    </div>

                    {/* Remover */}
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6m4-6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-4 text-black">Resumo do Pedido</h2>
              
              {/* Subtotal */}
              <div className="flex justify-between mb-2">
                <span className="text-black">Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'})</span>
                <span className="text-black font-medium">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>

              {/* Frete */}
              <div className="border-t pt-4 mb-4">
                <label className="block mb-2 font-medium text-black">Calcular Frete</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Digite seu CEP"
                    value={cep}
                    onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
                    maxLength={8}
                    className="flex-1 px-3 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-[#5179C8] text-black placeholder-gray-600"
                  />
                  <button
                    onClick={calculateFrete}
                    className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
                  >
                    Calcular
                  </button>
                </div>
                {frete !== null && (
                  <div className="mt-2 text-sm text-green-600">
                    Frete: R$ {frete.toFixed(2).replace('.', ',')}
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold">
                  <span className="text-black">Total</span>
                  <span style={{ color: '#2A289B' }}>
                    R$ {total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                {subtotal < 99 && (
                  <p className="text-sm text-black mt-2">
                    Faltam R$ {(99 - subtotal).toFixed(2).replace('.', ',')} para frete grátis!
                  </p>
                )}
              </div>

              {/* Botões */}
              <button
                className="w-full py-3 text-white font-medium rounded mb-3"
                style={{ backgroundColor: '#5179C8' }}
              >
                Finalizar Compra
              </button>
              
              <Link
                href="/loja"
                className="block w-full py-3 text-center border border-[#5179C8] text-[#5179C8] font-medium rounded hover:bg-[#5179C8] hover:text-white transition-colors"
              >
                Continuar Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}