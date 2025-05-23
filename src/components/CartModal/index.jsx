import React, { useState, useEffect } from 'react'
import { useCart } from '../../contexts/CartContext'
import { updateProduto, getProdutoById, getProdutos } from '../../services/api'
import qrCodeImage from '../../images/qrcode..jpg'
import thankYouImage from '../../images/image.png'

function CartModal({ isOpen, onClose }) {
  const { cart, removeFromCart, clearCart, getTotal } = useCart()
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showThankYouModal, setShowThankYouModal] = useState(false)
  const [showEmptyCartModal, setShowEmptyCartModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    document.body.style.zoom = '73%';
    return () => {
      document.body.style.zoom = '100%';
    };
  }, []);

  const handleFinalizarCompra = async () => {
    if (cart.length === 0) {
      setShowEmptyCartModal(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Atualiza o estoque de cada produto
      for (const item of cart) {
        // Busca o produto atual para ter a quantidade atualizada
        const response = await getProdutoById(item.id);
        const produto = response.data;
        
        // Calcula nova quantidade
        const quantidadeComprada = item.quantidadeNoCarrinho || 1;
        const novaQuantidade = produto.quantidade - quantidadeComprada;
        
        if (novaQuantidade < 0) {
          throw new Error(`Produto ${produto.nome} sem estoque suficiente!`);
        }

        // Atualiza o produto com a nova quantidade
        await updateProduto(item.id, {
          ...produto,
          quantidade: novaQuantidade
        });
      }

      // Atualiza os dados dos produtos
      await getProdutos();
      
      // Dispara evento para atualizar a lista de produtos
      window.dispatchEvent(new Event('produtosUpdated'));

      // Limpa o carrinho e mostra mensagem de sucesso
      clearCart();
      setShowPaymentModal(false);
      setShowThankYouModal(true);

      // Fecha o modal de agradecimento após 3 segundos
      setTimeout(() => {
        setShowThankYouModal(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
      setError(error.message || 'Erro ao processar a compra. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-xs">
          <div className="h-full flex flex-col bg-white shadow-xl">
            {/* Header */}
            <div className="px-1 py-0.5 bg-gray-50 sm:px-2">
              <div className="flex items-start justify-between">
                <h2 className="text-xs font-medium text-gray-900">
                  Carrinho de Compras
                </h2>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  onClick={onClose}
                >
                  <span className="sr-only">Fechar</span>
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Lista de Produtos */}
            <div className="flex-1 overflow-y-auto px-1 py-0.5 sm:px-2">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded relative mb-2 text-xs">
                  {error}
                </div>
              )}

              {cart.length === 0 ? (
                <p className="text-center text-gray-500">Seu carrinho está vazio</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <li key={item.id} className="py-0.5">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-xs font-medium text-gray-900">{item.nome}</h3>
                          <p className="mt-0.5 text-xs text-gray-500">
                            Quantidade: {item.quantidadeNoCarrinho || 1}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500">
                            R$ {item.preco.toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-1 text-red-600 hover:text-red-800"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-1 py-0.5 sm:px-2">
              <div className="flex justify-between text-xs font-medium text-gray-900 mb-0.5">
                <p>Total</p>
                <p>R$ {getTotal().toFixed(2)}</p>
              </div>
              <button
                onClick={() => {
                  if (cart.length === 0) {
                    setShowEmptyCartModal(true);
                    return;
                  }
                  setShowPaymentModal(true);
                }}
                disabled={loading || cart.length === 0}
                className={`w-full ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-0.5 px-2 rounded-md transition-colors`}
              >
                {loading ? 'Processando...' : 'Finalizar Compra'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Pagamento */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => !loading && setShowPaymentModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white p-3 rounded-lg shadow-xl max-w-xs w-full">
              <h2 className="text-sm font-medium text-gray-900 mb-2">Realize o pagamento</h2>
              <img src={qrCodeImage} alt="QR Code" className="max-w-full mb-2" />
              <button
                onClick={handleFinalizarCompra}
                disabled={loading}
                className={`w-full ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white py-1 px-3 rounded-md transition-colors`}
              >
                {loading ? 'Processando...' : 'Pagamento Realizado'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Agradecimento */}
      {showThankYouModal && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" />
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white p-3 rounded-lg shadow-xl max-w-xs w-full text-center">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Compra realizada com sucesso!</h2>
              <p className="text-sm text-gray-600 mb-2">Obrigado pela sua compra!</p>
              <img src={thankYouImage} alt="Obrigado" className="max-w-full mb-2 mx-auto" />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Carrinho Vazio */}
      {showEmptyCartModal && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowEmptyCartModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white p-3 rounded-lg shadow-xl max-w-xs w-full text-center">
              <h2 className="text-sm font-medium text-gray-900 mb-2">Carrinho Vazio</h2>
              <p className="text-xs text-gray-600 mb-2">Adicione produtos ao carrinho antes de finalizar a compra.</p>
              <button
                onClick={() => setShowEmptyCartModal(false)}
                className="w-full bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartModal; 