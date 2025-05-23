// contexts/CartContext.js
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  // ===== ESTADOS =====
  const [cart, setCart] = useState([]);           // Produtos no carrinho
  const [isCartOpen, setIsCartOpen] = useState(false); // Modal aberto/fechado
  const [vendas, setVendas] = useState([]);       // Histórico de vendas

  // ===== FUNÇÕES DO CARRINHO =====
  
  /**
   * Adiciona produto ao carrinho
   * @param {Object} produto - Objeto do produto
   */
  const addToCart = (produto) => {
    setCart(prevCart => [...prevCart, produto]);
    setIsCartOpen(true); // Abre o carrinho automaticamente
  };

  /**
   * Remove produto específico do carrinho
   * @param {number} produtoId - ID do produto
   */
  const removeFromCart = (produtoId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== produtoId));
  };

  /**
   * Limpa todo o carrinho
   */
  const clearCart = () => {
    setCart([]);
    setIsCartOpen(false);
  };

  /**
   * Calcula o total do carrinho
   */
  const getTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.preco * (item.quantidadeNoCarrinho || 1));
    }, 0);
  };

  // ===== FUNÇÃO PRINCIPAL: REGISTRAR VENDA =====
  
  /**
   * Registra uma nova venda no histórico
   * Esta é a função que conecta carrinho → vendas
   * @param {Object} dadosVenda - Dados da venda
   */
  const registrarVenda = async (dadosVenda) => {
    const novaVenda = {
      id: Date.now(), // ID único baseado em timestamp
      data: new Date().toLocaleDateString('pt-BR'),
      hora: new Date().toLocaleTimeString('pt-BR'),
      ...dadosVenda // Espalha os dados recebidos
    };
    
    // Adiciona a nova venda ao array de vendas
    setVendas(prevVendas => [...prevVendas, novaVenda]);
  };

  // ===== PROVIDER =====
  return (
    <CartContext.Provider value={{
      // Estados
      cart,
      isCartOpen,
      vendas,
      // Funções
      setCart,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      clearCart,
      getTotal,
      registrarVenda
    }}>
      {children}
    </CartContext.Provider>
  );
}

// Hook personalizado para usar o contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};