import React, { createContext, useState, useContext } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const getEstoqueDisponivel = (produto) => {
    return produto.estoque ?? produto.quantidade ?? 0
  }

  const addToCart = (produto) => {
    const estoqueDisponivel = getEstoqueDisponivel(produto)
    
    // Verifica se o produto já está no carrinho
    const produtoNoCarrinho = cart.find(item => item.id === produto.id)
    
    if (produtoNoCarrinho) {
      // Se já existe no carrinho, verifica se pode adicionar mais
      if (produtoNoCarrinho.quantidadeNoCarrinho >= estoqueDisponivel) {
        console.warn('Quantidade máxima em estoque atingida')
        return false
      }
      
      // Atualiza a quantidade do produto no carrinho
      setCart(prevCart => prevCart.map(item => 
        item.id === produto.id 
          ? { ...item, quantidadeNoCarrinho: (item.quantidadeNoCarrinho || 1) + 1 }
          : item
      ))
    } else {
      // Adiciona novo produto ao carrinho
      setCart(prevCart => [...prevCart, { ...produto, quantidadeNoCarrinho: 1 }])
    }
    
    setIsCartOpen(true)
    return true
  }

  const removeFromCart = (produtoId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== produtoId))
  }

  const updateQuantidade = (produtoId, novaQuantidade) => {
    const produto = cart.find(item => item.id === produtoId)
    if (!produto) return false

    const estoqueDisponivel = getEstoqueDisponivel(produto)
    if (novaQuantidade > estoqueDisponivel) {
      console.warn('Quantidade solicitada maior que o estoque disponível')
      return false
    }

    setCart(prevCart => prevCart.map(item =>
      item.id === produtoId
        ? { ...item, quantidadeNoCarrinho: novaQuantidade }
        : item
    ))
    return true
  }

  const clearCart = () => {
    setCart([])
  }

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.preco * (item.quantidadeNoCarrinho || 1)), 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + (item.quantidadeNoCarrinho || 1), 0)
  }

  const toggleCart = () => {
    setIsCartOpen(prev => !prev)
  }

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      getTotal,
      getTotalItems,
      isCartOpen,
      toggleCart,
      setIsCartOpen,
      updateQuantidade
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider')
  }
  return context
} 