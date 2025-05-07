import React, { useState, useEffect } from 'react'
import api from '../../services/api'

function ProductForm() {
  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    quantidade: '',
    imgLink: ''
  })
  const [message, setMessage] = useState({ type: '', text: '' })
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Buscar produtos ao carregar o componente
  useEffect(() => {
    console.log('Iniciando busca de produtos...')
    fetchProdutos()
  }, [])

  const fetchProdutos = async () => {
    try {
      setLoading(true)
      console.log('Fazendo requisição GET para /api/Produto')
      const response = await api.get('/api/Produto')
      console.log('Produtos recebidos:', response.data)
      setProdutos(response.data)
    } catch (error) {
      console.error('Erro detalhado ao buscar produtos:', {
        message: error.message,
        code: error.code,
        response: error.response,
        request: error.request
      })
      
      let errorMessage = 'Erro ao carregar produtos. '
      
      if (error.code === 'ECONNABORTED') {
        errorMessage += 'A API demorou muito para responder.'
      } else if (!error.response) {
        errorMessage += 'Não foi possível conectar com a API. Verifique se ela está rodando em http://localhost:7223'
      } else {
        errorMessage += error.response.data?.message || error.message
      }

      setMessage({
        type: 'error',
        text: errorMessage
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      console.log('Preparando dados para envio:', formData)
      
      const produtoData = {
        nome: formData.nome,
        preco: parseFloat(formData.preco),
        quantidade: parseInt(formData.quantidade),
        imgLink: formData.imgLink
      }

      console.log('Dados formatados para envio:', produtoData)
      console.log('Fazendo requisição POST para /api/Produto')

      const response = await api.post('/api/Produto', produtoData)
      console.log('Resposta da API:', response.data)

      // Mostrar modal de sucesso
      setShowSuccessModal(true)
      
      // Limpar formulário
      setFormData({
        nome: '',
        preco: '',
        quantidade: '',
        imgLink: ''
      })

      // Atualizar lista de produtos
      fetchProdutos()

      // Esconder modal após 3 segundos
      setTimeout(() => {
        setShowSuccessModal(false)
      }, 3000)

    } catch (error) {
      console.error('Erro detalhado ao cadastrar produto:', {
        message: error.message,
        code: error.code,
        response: error.response,
        request: error.request
      })
      
      let errorMessage = 'Erro ao cadastrar produto. '
      
      if (error.code === 'ECONNABORTED') {
        errorMessage += 'A API demorou muito para responder.'
      } else if (!error.response) {
        errorMessage += 'Não foi possível conectar com a API. Verifique se ela está rodando em http://localhost:7223'
      } else {
        errorMessage += error.response.data?.message || error.message
      }

      setMessage({
        type: 'error',
        text: errorMessage
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Modal de Sucesso */}
      {showSuccessModal && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in-down">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Produto cadastrado com sucesso!</span>
        </div>
      )}

      {/* Formulário de Cadastro */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Cadastrar Produto</h2>

        {message.text && (
          <div className={`p-3 mb-4 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium mb-1">
                Nome do Produto
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
                placeholder="Digite o nome do produto"
              />
            </div>

            <div>
              <label htmlFor="preco" className="block text-sm font-medium mb-1">
                Preço
              </label>
              <input
                type="number"
                id="preco"
                name="preco"
                value={formData.preco}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full p-2 border rounded"
                placeholder="Digite o preço"
              />
            </div>

            <div>
              <label htmlFor="quantidade" className="block text-sm font-medium mb-1">
                Quantidade
              </label>
              <input
                type="number"
                id="quantidade"
                name="quantidade"
                value={formData.quantidade}
                onChange={handleChange}
                required
                min="0"
                className="w-full p-2 border rounded"
                placeholder="Digite a quantidade"
              />
            </div>

            <div>
              <label htmlFor="imgLink" className="block text-sm font-medium mb-1">
                Link da Imagem
              </label>
              <input
                type="url"
                id="imgLink"
                name="imgLink"
                value={formData.imgLink}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
                placeholder="Cole o link da imagem"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded text-white ${
              loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Produtos Cadastrados</h2>
        {loading ? (
          <p className="text-center text-gray-600">Carregando produtos...</p>
        ) : produtos.length === 0 ? (
          <p className="text-center text-gray-600">Nenhum produto cadastrado</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {produtos.map((produto) => (
                  <tr key={produto.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{produto.nome}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">R$ {produto.preco.toFixed(2)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{produto.quantidade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductForm 