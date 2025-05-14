import React, { useState, useEffect } from 'react'
import api from '../../services/api'

function Sales() {
  const [vendas, setVendas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchVendas()
  }, [])

  const fetchVendas = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/Venda')
      setVendas(response.data)
    } catch (error) {
      console.error('Erro ao buscar vendas:', error)
      setError('Erro ao carregar vendas. Verifique se a API está rodando.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="content-container">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Controle de Vendas</h1>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-3">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-600">Carregando vendas...</p>
        ) : vendas.length === 0 ? (
          <p className="text-center text-gray-600">Nenhuma venda registrada</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendas.map((venda) => (
              <div key={venda.id} className="border rounded-lg p-3 hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-base mb-1">Venda #{venda.id}</h3>
                <p className="text-gray-600 text-sm mb-1">Data: {new Date(venda.data).toLocaleDateString()}</p>
                <p className="text-gray-600 text-sm mb-1">Total: R$ {venda.total.toFixed(2)}</p>
                <p className="text-gray-500 text-xs">Itens: {venda.itens?.length || 0}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Sales 