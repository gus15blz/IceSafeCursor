import React, { useEffect, useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { getProdutos, registrarVenda, atualizarEstoque } from '../../services/api';

function Sales() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cart, clearCart } = useCart();

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const response = await getProdutos();
      setSalesData(response.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
      setError('Não foi possível carregar os produtos. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const finalizarCompra = async () => {
    if (!cart.length) {
      alert('Adicione produtos ao carrinho antes de finalizar a compra.');
      return;
    }

    try {
      // 1. Registrar venda
      const venda = {
        itens: cart.map(item => ({
          produtoId: item.id,
          quantidade: 1,
          precoUnitario: item.preco
        })),
        total: cart.reduce((sum, item) => sum + item.preco, 0),
        data: new Date().toISOString()
      };

      await registrarVenda(venda);

      // 2. Atualizar o estoque de cada produto
      for (const produto of cart) {
        const novoEstoque = produto.estoque - 1;
        await atualizarEstoque(produto.id, novoEstoque);
      }

      // 3. Limpar carrinho e atualizar lista
      clearCart();
      await fetchSalesData();
      alert('Venda finalizada com sucesso!');
    } catch (error) {
      console.error('Erro ao finalizar a compra:', error);
      alert('Erro ao finalizar a venda. Por favor, tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Carregando produtos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <p className="font-bold">Erro</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Produtos Disponíveis</h2>
          <button
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            onClick={finalizarCompra}
            disabled={!cart.length}
          >
            Finalizar Compra
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {salesData.map((produto) => (
            <div key={produto.id} className="border rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold">{produto.nome}</h3>
              <p className="text-gray-600">Preço: R$ {produto.preco?.toFixed(2)}</p>
              <p className="text-gray-600">Estoque: {produto.estoque}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sales;