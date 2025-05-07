import React, { useState, useEffect } from 'react'
import api from '../../services/api'

function CartModal({ isOpen, onClose }) {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      fetchProdutos()
    }
  }, [isOpen])

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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Carrinho de Compras</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-4 overflow-y-auto h-[calc(100%-4rem)]">
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
            <div className="space-y-4">
              {produtos.map((produto) => (
                <div key={produto.id} className="flex items-center gap-4 p-2 border rounded">
                  {produto.imgLink && (
                    <img 
                      src={produto.imgLink} 
                      alt={produto.nome}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{produto.nome}</h3>
                    <p className="text-gray-600">R$ {produto.preco.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 bg-gray-200 rounded">-</button>
                    <span>1</span>
                    <button className="px-2 py-1 bg-gray-200 rounded">+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold">Total:</span>
            <span className="font-bold">R$ 10,00</span>
          </div>
          <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors">
            Finalizar Compra
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartModal 