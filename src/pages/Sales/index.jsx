import React, { useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';

function Sales() {
  const { vendas } = useCart();

  useEffect(() => {
    // Define o zoom para 80% quando o componente monta
    document.body.style.zoom = '80%';

    // Retorna o zoom para 100% quando o componente desmonta
    return () => {
      document.body.style.zoom = '100%';
    };
  }, []);

  const formatarMoeda = (valor) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const calcularVendasMensais = () => {
    const hoje = new Date();
    const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    
    const vendasMes = vendas.filter(venda => {
      const dataVenda = new Date(venda.data.split('/').reverse().join('-'));
      return dataVenda >= primeiroDiaMes;
    });

    const totalMes = vendasMes.reduce((total, venda) => total + venda.total, 0);
    
    return {
      quantidade: vendasMes.length,
      total: totalMes
    };
  };

  const resumoMensal = calcularVendasMensais();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Histórico de Vendas</h1>
        
        {vendas.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhuma venda registrada ainda.</p>
            <p className="text-sm text-gray-400">
              As vendas aparecerão aqui após finalizar compras no carrinho.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-8">
              {vendas.map((venda) => (
                <div key={venda.id} className="border rounded-lg p-4 bg-white shadow">
                  {/* Cabeçalho da Venda */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Venda #{venda.id}
                    </h3>
                    <div className="text-sm text-gray-500">
                      <span className="mr-2">{venda.data}</span>
                      <span>{venda.hora}</span>
                    </div>
                  </div>

                  {/* Lista de Itens */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Itens:</h4>
                    <div className="space-y-2">
                      {venda.itens.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <div>
                            <span className="text-gray-800">{item.nome}</span>
                            <span className="text-gray-500 ml-2">
                              (x{item.quantidade})
                            </span>
                          </div>
                          <span className="text-gray-800">
                            {formatarMoeda(item.preco * item.quantidade)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-800">Total da Venda:</span>
                      <span className="text-gray-800">{formatarMoeda(venda.total)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumo Mensal */}
            <div className="border-t-2 pt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Resumo do Mês Atual</h2>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg shadow">
                    <p className="text-sm text-gray-600 mb-1">Quantidade de Vendas</p>
                    <p className="text-2xl font-bold text-blue-600">{resumoMensal.quantidade}</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow">
                    <p className="text-sm text-gray-600 mb-1">Total em Vendas</p>
                    <p className="text-2xl font-bold text-green-600">{formatarMoeda(resumoMensal.total)}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Sales; 

