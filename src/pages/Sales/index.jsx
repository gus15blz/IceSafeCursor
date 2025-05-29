import React, { useEffect, useState } from 'react';
import { getVendas, getVendasPorPeriodo, getResumoVendas } from '../../services/api';

function Sales() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vendas, setVendas] = useState([]);
  const [resumo, setResumo] = useState(null);
  const [filtroData, setFiltroData] = useState({
    dataInicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    dataFim: new Date()
  });

  useEffect(() => {
    document.body.style.zoom = '80%';
    fetchDados();
    return () => {
      document.body.style.zoom = '100%';
    };
  }, []);

  const fetchDados = async () => {
    try {
      setLoading(true);
      setError(null);

      // Primeiro tenta buscar todas as vendas
      const vendasResponse = await getVendas();
      console.log('Resposta inicial de vendas:', vendasResponse);

      if (vendasResponse.data) {
        setVendas(Array.isArray(vendasResponse.data) ? vendasResponse.data : []);
        
        // Se conseguiu as vendas, tenta buscar o resumo
        try {
          const resumoResponse = await getResumoVendas();
          setResumo(resumoResponse.data);
        } catch (resumoError) {
          console.error('Erro ao buscar resumo:', resumoError);
          // Não mostra erro para o usuário se apenas o resumo falhar
        }
      } else {
        throw new Error('Dados de vendas não recebidos');
      }

    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Não foi possível carregar os dados. Por favor, tente novamente.');
      
      // Se a rota principal falhar, tenta a rota por período
      try {
        console.log('Tentando buscar por período após falha na rota principal');
        const vendasPeriodoResponse = await getVendasPorPeriodo(
          filtroData.dataInicio,
          filtroData.dataFim
        );
        
        if (vendasPeriodoResponse.data) {
          setVendas(Array.isArray(vendasPeriodoResponse.data) ? vendasPeriodoResponse.data : []);
          setError(null); // Limpa o erro se conseguiu recuperar
        }
      } catch (periodoError) {
        console.error('Erro também na busca por período:', periodoError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltroData(prev => ({
      ...prev,
      [name]: new Date(value)
    }));
  };

  const handleFiltrar = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      const response = await getVendasPorPeriodo(filtroData.dataInicio, filtroData.dataFim);
      console.log('Resposta do filtro:', response);
      
      if (response.data) {
        setVendas(Array.isArray(response.data) ? response.data : []);
      } else {
        throw new Error('Dados não recebidos ao filtrar');
      }
    } catch (err) {
      console.error('Erro ao filtrar vendas:', err);
      setError('Não foi possível filtrar as vendas. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatarMoeda = (valor) => {
    if (typeof valor !== 'number') return 'R$ 0,00';
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatarData = (dataString) => {
    try {
      if (!dataString) return '';
      const data = new Date(dataString);
      if (isNaN(data.getTime())) return dataString;
      return data.toLocaleDateString('pt-BR');
    } catch (error) {
      return dataString;
    }
  };

  const formatarHora = (dataString) => {
    try {
      if (!dataString) return '';
      const data = new Date(dataString);
      if (isNaN(data.getTime())) return '';
      return data.toLocaleTimeString('pt-BR');
    } catch (error) {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center py-8">
            <p className="text-gray-500">Carregando dados...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Histórico de Vendas</h1>
          <button 
            onClick={fetchDados}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Atualizar
          </button>
        </div>

        {/* Filtro por Período */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Filtrar por Período</h2>
          <form onSubmit={handleFiltrar} className="flex gap-4 items-end">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Data Início</label>
              <input
                type="date"
                name="dataInicio"
                value={filtroData.dataInicio.toISOString().split('T')[0]}
                onChange={handleFiltroChange}
                className="border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Data Fim</label>
              <input
                type="date"
                name="dataFim"
                value={filtroData.dataFim.toISOString().split('T')[0]}
                onChange={handleFiltroChange}
                className="border rounded px-3 py-2"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Filtrar
            </button>
          </form>
        </div>

        {error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={fetchDados}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        ) : (
          <>
            {/* Resumo Geral */}
            {resumo && (
              <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Resumo Geral</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Total de Vendas</p>
                    <p className="text-2xl font-bold text-blue-600">{resumo.totalVendas || 0}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Valor Total</p>
                    <p className="text-2xl font-bold text-green-600">{formatarMoeda(resumo.valorTotal || 0)}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Média por Venda</p>
                    <p className="text-2xl font-bold text-purple-600">{formatarMoeda(resumo.mediaVendas || 0)}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Vendas Hoje</p>
                    <p className="text-2xl font-bold text-orange-600">{resumo.vendasHoje || 0}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Lista de Vendas */}
            <div className="space-y-6">
              {vendas.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhuma venda encontrada no período selecionado.</p>
                </div>
              ) : (
                vendas.map((venda) => (
                  <div key={venda.id || Math.random()} className="border rounded-lg p-4 bg-white shadow">
                    {/* Cabeçalho da Venda */}
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Venda #{venda.id || 'N/A'}
                      </h3>
                      <div className="text-sm text-gray-500">
                        <span className="mr-2">{formatarData(venda.data)}</span>
                        <span>{formatarHora(venda.data)}</span>
                      </div>
                    </div>

                    {/* Lista de Itens */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Itens:</h4>
                      <div className="space-y-2">
                        {Array.isArray(venda.itens) ? (
                          venda.itens.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <div>
                                <span className="text-gray-800">{item.nome || 'Produto sem nome'}</span>
                                <span className="text-gray-500 ml-2">
                                  (x{item.quantidade || 0})
                                </span>
                              </div>
                              <div className="flex space-x-4">
                                <span className="text-gray-600">
                                  {formatarMoeda(item.precoUnitario || 0)} un
                                </span>
                                <span className="text-gray-800 font-medium">
                                  {formatarMoeda(item.total || 0)}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500">Nenhum item registrado</p>
                        )}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-semibold">
                        <span className="text-gray-800">Total da Venda:</span>
                        <span className="text-gray-800">{formatarMoeda(venda.total || 0)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Sales; 

