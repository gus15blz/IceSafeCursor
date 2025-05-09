import React, { useState, useEffect } from 'react'
import gelaImage from '../../images/gela.jpg'
import api from '../../services/api'
import { useCart } from '../../contexts/CartContext'

function Home() {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })
  const { addToCart, setIsCartOpen } = useCart()

  useEffect(() => {
    fetchProdutos()
  }, [])

  const fetchProdutos = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/Produto')
      setProdutos(response.data)
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
      setError('Erro ao carregar produtos. Verifique se a API está rodando.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (produto) => {
    addToCart(produto)
    setIsCartOpen(true)
    setMessage({
      type: 'success',
      text: `${produto.nome} adicionado ao carrinho!`
    })
  }

  return (
    <div className="content-container">
      {/* Seção Inicial */}
      <section className="rounded-lg shadow-md p-3 mb-3 max-w-full mx-auto" style={{ backgroundColor: '#3192ca' }}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 text-left">
            <p className="text-white text-lg font-bold tracking-wide">
              SNAKS RAPIDOS PARA
            </p>
            <p className="text-white text-lg font-bold tracking-wide">
              SEU TRABALHO
            </p>
          </div>
          <div className="flex-shrink-0">
            <img 
              src={gelaImage} 
              alt="Gela" 
              className="rounded-lg shadow-lg w-44 h-44 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Seção de Produtos */}
      <section className="bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Produtos</h2>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-3">
            {error}
          </div>
        )}

        {message.text && (
          <div className={`p-3 mb-3 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-600">Carregando produtos...</p>
        ) : produtos.length === 0 ? (
          <p className="text-center text-gray-600">Nenhum produto disponível</p>
        ) : (
          <div className="grid product-grid">
            {produtos.map((produto) => (
              <div key={produto.id} className="product-card border rounded-lg hover:shadow-lg transition-shadow">
                {produto.imgLink && (
                  <img 
                    src={produto.imgLink} 
                    alt={produto.nome}
                    className="product-image w-full object-cover rounded-lg mb-2"
                  />
                )}
                <div className="p-3">
                  <h3 className="font-bold text-base mb-1">{produto.nome}</h3>
                  <p className="text-gray-600 text-sm mb-1">R$ {produto.preco.toFixed(2)}</p>
                  <p className="text-gray-500 text-xs mb-3">Estoque: {produto.quantidade}</p>
                  <button
                    onClick={() => handleAddToCart(produto)}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center text-sm"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home 