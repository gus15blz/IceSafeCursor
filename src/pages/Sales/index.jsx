/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import  { useState, useEffect } from 'react'
import api from '../../services/api'
import { useCart } from '../../contexts/CartContext';

function Sales() {
  const [, setVendas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resumo, setResumo] = useState({ semanal: 0, mensal: 0, totalGeral: 0, totalSemanal: 0, totalMensal: 0 })
  const [produtos, setProdutos] = useState([])
  const [vendas, setVendasState] = useState([])
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [vendasFiltradas, setVendasFiltradas] = useState([])
  const [showProdutosModal, setShowProdutosModal] = useState(false)
  const { cart, clearCart } = useCart();

  useEffect(() => {
    document.body.style.zoom = '60%';
    fetchVendas()
    return () => {
      document.body.style.zoom = '100%';
    };
  }, [])

  const fetchVendas = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/Venda')
      console.log('Payload de vendas:', response.data)
      const vendasData = Array.isArray(response.data) ? response.data : (response.data.vendas || response.data.data || [])
      setVendas(vendasData)
      setVendasState(vendasData)
      setVendasFiltradas(vendasData)
      calcularResumo(vendasData)
      calcularProdutos(vendasData)
    } catch (error) {
      console.error('Erro ao buscar vendas:', error)
      setError('Erro ao carregar vendas. Verifique se a API está rodando.')
    } finally {
      setLoading(false)
    }
  }

  const filtrarPorData = () => {
    if (!dataInicio && !dataFim) {
      setVendasFiltradas(vendas)
      calcularResumo(vendas)
      calcularProdutos(vendas)
      return
    }
    const inicio = dataInicio ? new Date(dataInicio) : null
    const fim = dataFim ? new Date(dataFim) : null
    const filtradas = vendas.filter(venda => {
      const dataVenda = new Date(venda.dataVenda || venda.data)
      if (inicio && dataVenda < inicio) return false
      if (fim && dataVenda > fim) return false
      return true
    })
    setVendasFiltradas(filtradas)
    calcularResumo(filtradas)
    calcularProdutos(filtradas)
  }

  const finalizarCompra = async () => {
    try {
      const itensVenda = cart.map((item) => ({
        produtoId: item.id,
        quantidade: item.quantidadeNoCarrinho || item.quantidade || 1,
        preco: item.preco,
      }));

      const response = await api.post('/api/vendas', {
        itens: itensVenda,
      });

      if (response.status === 200) {
        clearCart();
        alert('Compra realizada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao finalizar a compra:', error);
      alert('Erro ao processar a compra. Tente novamente.');
    }
  };

  const calcularResumo = (vendasData) => {
    const agora = new Date()
    let totalGeral = 0;
    let totalSemanal = 0;
    let totalMensal = 0;
    const vendasSemanais = vendasData.filter((venda) => {
      const dataVenda = new Date(venda.dataVenda || venda.data)
      const diferencaDias = (agora - dataVenda) / (1000 * 60 * 60 * 24)
      const isSemanal = diferencaDias <= 7;
      if (isSemanal) {
        totalSemanal += (venda.preco || 0) * (venda.quantidade || 0);
      }
      return isSemanal;
    })

    const vendasMensais = vendasData.filter((venda) => {
      const dataVenda = new Date(venda.dataVenda || venda.data)
      const diferencaDias = (agora - dataVenda) / (1000 * 60 * 60 * 24)
      const isMensal = diferencaDias <= 30;
      if (isMensal) {
        totalMensal += (venda.preco || 0) * (venda.quantidade || 0);
      }
      return isMensal;
    })

    totalGeral = vendasData.reduce((total, venda) => {
      return total + ((venda.preco || 0) * (venda.quantidade || 0));
    }, 0);

    setResumo({
      semanal: vendasSemanais.length,
      mensal: vendasMensais.length,
      totalGeral,
      totalSemanal,
      totalMensal
    })
  }

  const calcularProdutos = (vendasData) => {
    const produtosMap = {}
    vendasData.forEach((venda) => {
      if (!produtosMap[venda.produtoId]) {
        produtosMap[venda.produtoId] = {
          produtoId: venda.produtoId,
          quantidade: 0
        }
      }
      produtosMap[venda.produtoId].quantidade += venda.quantidade
    })
    setProdutos(Object.values(produtosMap))
  }

  const calcularTotalGeral = () => {
    return vendasFiltradas.reduce((total, venda) => {
      return total + ((venda.preco || 0) * (venda.quantidade || 0));
    }, 0);
  }

  // Função utilitária para formatar moeda
  const formatarMoeda = (valor) => {
    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <div className="container mx-auto px-2 py-4 min-h-screen">
      {/* Filtro de datas */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-8 border border-blue-200 flex flex-col md:flex-row items-center gap-4">
        <div className="flex flex-col md:flex-row items-center gap-2">
          <label className="font-medium text-gray-700">Data início:</label>
          <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className="border rounded px-2 py-1" />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2">
          <label className="font-medium text-gray-700">Data fim:</label>
          <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} className="border rounded px-2 py-1" />
        </div>
        <button onClick={filtrarPorData} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">Filtrar</button>
        <button onClick={() => { setDataInicio(''); setDataFim(''); setVendasFiltradas(vendas); calcularResumo(vendas); calcularProdutos(vendas); }} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors">Limpar</button>
      </section>

      {/* Seção Resumo */}
      <section className="rounded-lg shadow-md p-6 mb-8 bg-white border border-blue-200">
        <h2 className="text-blue-600 text-2xl font-bold leading-tight mb-2">Resumo</h2>
        <p className="text-gray-600">Vendas na última semana: {resumo.semanal} | Valor: R$ {resumo.totalSemanal.toFixed(2)}</p>
        <p className="text-gray-600">Vendas nos últimos 30 dias: {resumo.mensal} | Valor: R$ {resumo.totalMensal.toFixed(2)}</p>
        <p className="text-gray-600 font-bold">Valor total de todas as vendas: R$ {resumo.totalGeral.toFixed(2)}</p>
      </section>

      {/* Botão para abrir o modal de produtos vendidos */}
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowProdutosModal(true)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
          Ver Produtos Vendidos
        </button>
      </div>

      {/* Modal de Produtos Vendidos */}
      {showProdutosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto relative">
            <button onClick={() => setShowProdutosModal(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Produtos Vendidos</h2>
            {produtos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Nenhum produto vendido</p>
              </div>
            ) : (
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Produto</th>
                    <th className="border border-gray-300 px-4 py-2">Quantidade Vendida</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map((produto, idx) => (
                    <tr key={idx}>
                      <td className="border border-gray-300 px-4 py-2">{produto.produtoId}</td>
                      <td className="border border-gray-300 px-4 py-2">{produto.quantidade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Seção Relatório Detalhado */}
      <section className="bg-white rounded-lg shadow-lg p-4 max-w-6xl w-full mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Relatório de Vendas</h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <p className="text-gray-600">Carregando vendas...</p>
          </div>
        ) : (
          vendasFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Nenhuma venda registrada</p>
            </div>
          ) : (
            <div className="max-h-[400px] rounded-lg border border-gray-300 w-full overflow-x-auto">
              <table className="min-w-[600px] w-full border-collapse">
                <thead className="bg-gray-100 sticky top-0 z-20">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 sticky top-0 left-0 bg-gray-100 z-30">Produto</th>
                    <th className="border border-gray-300 px-4 py-2 sticky top-0 bg-gray-100 z-20">Quantidade</th>
                    <th className="border border-gray-300 px-4 py-2 sticky top-0 bg-gray-100 z-20">Valor Total</th>
                    <th className="border border-gray-300 px-4 py-2 sticky top-0 bg-gray-100 z-20">Data/Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {vendasFiltradas.map((venda, idx) => (
                    <tr key={idx}>
                      <td className="border border-gray-300 px-4 py-2">{venda.produtoId}</td>
                      <td className="border border-gray-300 px-4 py-2">{venda.quantidade}</td>
                      <td className="border border-gray-300 px-4 py-2 font-bold">{formatarMoeda(venda.valorTotal)}</td>
                      <td className="border border-gray-300 px-4 py-2">{venda.dataHora ? new Date(venda.dataHora).toLocaleString('pt-BR') : '-'}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} className="border border-gray-300 px-4 py-2 font-bold text-right bg-gray-100 sticky bottom-0 z-10">
                      Total Geral: {formatarMoeda(vendasFiltradas.reduce((total, venda) => total + (venda.valorTotal || 0), 0))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )
        )}
      </section>
    </div>
  )
}

export default Sales

