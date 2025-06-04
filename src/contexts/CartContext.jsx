// contexts/CartContext.js
import React, { createContext, useContext, useState } from 'react';
import api, { finalizarVenda } from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  // ===== ESTADOS =====
  const [cart, setCart] = useState([]);           // Produtos no carrinho
  const [isCartOpen, setIsCartOpen] = useState(false); // Modal aberto/fechado
  const [vendas, setVendas] = useState([]);       // Histórico de vendas local

  // ===== FUNÇÕES DO CARRINHO =====
  
  /**
   * Adiciona produto ao carrinho
   * @param {Object} produto - Objeto do produto
   */
  const addToCart = (produto) => {
    // Verifica se o produto já existe no carrinho
    const existingItem = cart.find(item => item.id === produto.id);
    
    if (existingItem) {
      // Se existe, atualiza a quantidade
      setCart(prevCart => prevCart.map(item =>
        item.id === produto.id
          ? { ...item, quantidadeNoCarrinho: (item.quantidadeNoCarrinho || 1) + 1 }
          : item
      ));
    } else {
      // Se não existe, adiciona com quantidade 1
      setCart(prevCart => [...prevCart, { ...produto, quantidadeNoCarrinho: 1 }]);
    }
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
   * Registra uma nova venda no histórico e no banco de dados
   * Esta é a função que conecta carrinho → vendas
   */
  const registrarVenda = async () => {
    try {
      // Gera data/hora no formato correto
      const now = new Date();
      const pad = (n, z = 2) => ("00" + n).slice(-z);
      const ms = pad(now.getMilliseconds(), 6);
      const dataVenda = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.${ms}-03`;
      // Monta o array de vendas
      const vendasParaRegistrar = cart.map(item => ({
        produtoId: item.id,
        quantidade: item.quantidadeNoCarrinho || 1,
        dataVenda
      }));
      // Salva a venda no banco de dados usando o endpoint correto
      const response = await finalizarVenda(vendasParaRegistrar);
      setVendas(prevVendas => [...prevVendas, ...vendasParaRegistrar]);
      return response;
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
      throw error;
    }
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