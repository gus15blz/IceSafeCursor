import React, { useState, useEffect } from 'react'
import gelaImage from '../../images/gela.jpg'
import api from '../../services/api'

function Home() {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

  return (
    <div className="content-container">
      {/* Seção Inicial */}
      <section className="rounded-lg shadow-md p-4 mb-4" style={{ backgroundColor: '#3192ca' }}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-left">
            <p className="text-white text-xl font-bold tracking-wide">
              SNAKS RAPIDOS PARA
            </p>
            <p className="text-white text-xl font-bold tracking-wide">
              SEU TRABALHO
            </p>
          </div>
          <div className="flex-shrink-0">
            <img 
              src={gelaImage} 
              alt="Gela" 
              className="rounded-lg shadow-lg w-48 h-48 object-cover"
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
                <h3 className="font-bold text-base mb-1">{produto.nome}</h3>
                <p className="text-gray-600 text-sm mb-1">R$ {produto.preco.toFixed(2)}</p>
                <p className="text-gray-500 text-xs">Estoque: {produto.quantidade}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home 