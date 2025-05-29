import React, { useState, useEffect } from 'react'
import gelaImage from '../../images/gela.jpg'
import { useCart } from '../../contexts/CartContext'
import { getProdutos } from '../../services/api'
import { finalizarCompra } from '../../services/api';


function Home() {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })
  const { addToCart, setIsCartOpen } = useCart()

  useEffect(() => {
    // Define o zoom para 75% quando o componente monta
    document.body.style.zoom = '75%';

    // Retorna o zoom para 100% quando o componente desmonta
    return () => {
      document.body.style.zoom = '100%';
    };
  }, []);

  useEffect(() => {
    fetchProdutos()
  }, [])

  const fetchProdutos = async () => {
    try {
      setLoading(true)
      const response = await getProdutos()
      // Mapeia os produtos para garantir que todos tenham o campo estoque
      const produtosComEstoque = response.data.map(produto => ({
        ...produto,
        estoque: produto.quantidade // Padronizando para usar apenas o campo quantidade
      }))
      setProdutos(produtosComEstoque)
      setError('')
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
      setError('Erro ao carregar produtos. Por favor, tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleFinalizarCompra = async () => {
    try {
      await finalizarCompra(cartItems); // cartItems: lista com produtoId e quantidade
      setCart([]); // limpa o carrinho após sucesso
      alert('Compra finalizada com sucesso!');
      
      // dispara evento para atualizar os produtos na Home
      window.dispatchEvent(new Event('produtosUpdated'));
    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
      alert('Erro ao finalizar compra.');
    }
  };

  // Adiciona um listener para o evento customizado
  useEffect(() => {
    const handleProdutosUpdate = () => {
      fetchProdutos();
    };

    // Adiciona o listener ao montar
    window.addEventListener('produtosUpdated', handleProdutosUpdate);

    // Remove o listener ao desmontar
    return () => {
      window.removeEventListener('produtosUpdated', handleProdutosUpdate);
    };
  }, []);

  const getEstoqueDisponivel = (produto) => {
    // Padronizando para usar apenas o campo quantidade
    return produto.quantidade || 0
  }

  const handleAddToCart = (produto) => {
    const estoqueDisponivel = getEstoqueDisponivel(produto)
    console.log('Produto:', produto.nome, 'Estoque disponível:', estoqueDisponivel)

    if (estoqueDisponivel <= 0) {
      setMessage({
        type: 'error',
        text: `${produto.nome} está fora de estoque!`
      })
      return
    }

    addToCart(produto)
    setIsCartOpen(true)
    setMessage({
      type: 'success',
      text: `${produto.nome} adicionado ao carrinho!`
    })

    setTimeout(() => {
      setMessage({ type: '', text: '' })
    }, 3000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Seção Inicial */}
      <section className="rounded-lg shadow-md p-6 mb-8 bg-white border border-blue-200">
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-blue-600 text-3xl font-bold leading-tight">
              SNACKS RÁPIDOS PARA
              <br />
              SEU TRABALHO
            </h1>
            <p className="text-gray-600 mt-2">
              Encontre as melhores opções de lanches para seu dia a dia
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
      <section className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Produtos Disponíveis</h2>
          {message.text && (
            <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message.text}
            </div>
          )}
        </div>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Carregando produtos...</p>
          </div>
        ) : produtos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Nenhum produto disponível</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produtos.map((produto) => {
              const estoqueDisponivel = getEstoqueDisponivel(produto)
              return (
                <div key={produto.id} className="border rounded-lg hover:shadow-lg transition-shadow duration-300">
                  {produto.imgLink && (
                    <img 
                      src={produto.imgLink} 
                      alt={produto.nome}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{produto.nome}</h3>
                    <p className="text-gray-700 text-lg mb-1">R$ {produto.preco?.toFixed(2)}</p>
                    <p className={`text-sm mb-4 ${estoqueDisponivel > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {estoqueDisponivel > 0 ? `Estoque: ${estoqueDisponivel}` : 'Fora de estoque'}
                    </p>
                    <button
                      onClick={() => handleAddToCart(produto)}
                      disabled={estoqueDisponivel <= 0}
                      className={`w-full py-2 px-4 rounded-md flex items-center justify-center text-sm font-medium transition-colors duration-200
                        ${estoqueDisponivel > 0 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {estoqueDisponivel > 0 ? 'Adicionar ao Carrinho' : 'Fora de Estoque'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home 