import { useState, useEffect } from 'react'
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
  const [editingProduct, setEditingProduct] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    fetchProdutos()
  }, [])

  const fetchProdutos = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/Produto')
      if (Array.isArray(response.data)) {
        setProdutos(response.data)
      } else {
        setMessage({
          type: 'error',
          text: 'Formato de dados inválido recebido da API'
        })
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
      setMessage({
        type: 'error',
        text: 'Erro ao carregar produtos. Verifique se a API está rodando.'
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
      
      const produtoData = {
        nome: formData.nome,
        preco: parseFloat(formData.preco),
        quantidade: parseInt(formData.quantidade),
        imgLink: formData.imgLink
      }

      await api.post('/api/Produto', produtoData)
      
      setShowSuccessModal(true)
      setMessage({
        type: 'success',
        text: 'Produto cadastrado com sucesso!'
      })
      
      setFormData({
        nome: '',
        preco: '',
        quantidade: '',
        imgLink: ''
      })

      fetchProdutos()

      setTimeout(() => {
        setShowSuccessModal(false)
      }, 3000)

    } catch (error) {
      console.error('Erro ao cadastrar produto:', error)
      setMessage({
        type: 'error',
        text: 'Erro ao cadastrar produto. Verifique os dados e tente novamente.'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (produto) => {
    setEditingProduct(produto)
    setFormData({
      nome: produto.nome,
      preco: produto.preco.toString(),
      quantidade: produto.quantidade.toString(),
      imgLink: produto.imgLink
    })
    setShowEditModal(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      const produtoData = {
        id: editingProduct.id,
        nome: formData.nome,
        preco: parseFloat(formData.preco),
        quantidade: parseInt(formData.quantidade),
        imgLink: formData.imgLink
      }

      await api.put(`/api/Produto/${editingProduct.id}`, produtoData)
      
      setShowSuccessModal(true)
      setMessage({
        type: 'success',
        text: 'Produto atualizado com sucesso!'
      })
      
      setShowEditModal(false)
      setEditingProduct(null)
      setFormData({
        nome: '',
        preco: '',
        quantidade: '',
        imgLink: ''
      })

      fetchProdutos()

      setTimeout(() => {
        setShowSuccessModal(false)
      }, 3000)

    } catch (error) {
      console.error('Erro ao atualizar produto:', error)
      setMessage({
        type: 'error',
        text: 'Erro ao atualizar produto. Verifique os dados e tente novamente.'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setLoading(true)
      await api.delete(`/api/Produto/${id}`)
      setMessage({
        type: 'success',
        text: 'Produto excluído com sucesso!'
      })
      fetchProdutos()
    } catch (error) {
      console.error('Erro ao excluir produto:', error)
      setMessage({
        type: 'error',
        text: 'Erro ao excluir produto. Tente novamente.'
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
          <span>Operação realizada com sucesso!</span>
        </div>
      )}

      {/* Modal de Edição */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Editar Produto</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label htmlFor="edit-nome" className="block text-sm font-medium mb-1">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  id="edit-nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label htmlFor="edit-preco" className="block text-sm font-medium mb-1">
                  Preço
                </label>
                <input
                  type="number"
                  id="edit-preco"
                  name="preco"
                  value={formData.preco}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label htmlFor="edit-quantidade" className="block text-sm font-medium mb-1">
                  Quantidade
                </label>
                <input
                  type="number"
                  id="edit-quantidade"
                  name="quantidade"
                  value={formData.quantidade}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label htmlFor="edit-imgLink" className="block text-sm font-medium mb-1">
                  Link da Imagem
                </label>
                <input
                  type="url"
                  id="edit-imgLink"
                  name="imgLink"
                  value={formData.imgLink}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 p-2 rounded text-white ${
                    loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingProduct(null)
                    setFormData({
                      nome: '',
                      preco: '',
                      quantidade: '',
                      imgLink: ''
                    })
                  }}
                  className="flex-1 p-2 rounded bg-gray-500 text-white hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
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

      {/* Lista de Produtos */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Produtos Cadastrados</h2>
        {loading ? (
          <p className="text-center text-gray-600">Carregando produtos...</p>
        ) : produtos.length === 0 ? (
          <p className="text-center text-gray-600">Nenhum produto cadastrado</p>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="min-w-[600px] w-full border-collapse">
              <thead className="bg-gray-100 sticky top-0 z-20">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 sticky top-0 left-0 bg-gray-100 z-30">Nome</th>
                  <th className="border border-gray-300 px-4 py-2 sticky top-0 bg-gray-100 z-20">Preço</th>
                  <th className="border border-gray-300 px-4 py-2 sticky top-0 bg-gray-100 z-20">Quantidade</th>
                  <th className="border border-gray-300 px-4 py-2 sticky top-0 bg-gray-100 z-20">Imagem</th>
                  <th className="border border-gray-300 px-4 py-2 sticky top-0 bg-gray-100 z-20">Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((produto) => (
                  <tr key={produto.id}>
                    <td className="border border-gray-300 px-4 py-2">{produto.nome}</td>
                    <td className="border border-gray-300 px-4 py-2">R$ {produto.preco.toFixed(2)}</td>
                    <td className="border border-gray-300 px-4 py-2">{produto.quantidade}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {produto.imgLink && (
                        <img src={produto.imgLink} alt={produto.nome} className="w-16 h-16 object-cover rounded" />
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => handleEdit(produto)}
                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(produto.id)}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                      >
                        Excluir
                      </button>
                    </td>
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