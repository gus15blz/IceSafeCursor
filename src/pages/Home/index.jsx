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
    <div className="space-y-8">
      {/* Seção Inicial */}
      <section className="rounded-lg shadow-md p-6" style={{ backgroundColor: '#3192ca' }}>
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1 text-left">
            <p className="text-white text-2xl font-bold tracking-wide">
              SNAKS RAPIDOS PARA
            </p>
            <p className="text-white text-2xl font-bold tracking-wide">
              SEU TRABALHO
            </p>
          </div>
          <div className="flex-shrink-0">
            <img 
              src={gelaImage} 
              alt="Gela" 
              className="rounded-lg shadow-lg w-64 h-64 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Seção de Produtos */}
      <section className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Produtos</h2>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-600">Carregando produtos...</p>
        ) : produtos.length === 0 ? (
          <p className="text-center text-gray-600">Nenhum produto disponível</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtos.map((produto) => (
              <div key={produto.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                {produto.imgLink && (
                  <img 
                    src={produto.imgLink} 
                    alt={produto.nome}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="font-bold text-lg mb-2">{produto.nome}</h3>
                <p className="text-gray-600 mb-2">R$ {produto.preco.toFixed(2)}</p>
                <p className="text-gray-500 text-sm">Quantidade em estoque: {produto.quantidade}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home 