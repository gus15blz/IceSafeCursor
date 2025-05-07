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
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Controle de Vendas</h1>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-600">Carregando vendas...</p>
        ) : vendas.length === 0 ? (
          <p className="text-center text-gray-600">Nenhuma venda registrada</p>
        ) : (
          <div className="grid gap-4">
            {vendas.map((venda) => (
              <div key={venda.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">Venda #{venda.id}</h3>
                    <p className="text-gray-600">Data: {new Date(venda.data).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">R$ {venda.valorTotal.toFixed(2)}</p>
                    <p className="text-gray-600">{venda.quantidade} itens</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Sales 