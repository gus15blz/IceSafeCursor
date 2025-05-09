import React, { useState, useEffect } from 'react'
import api from '../../services/api'

function Sales() {
  const [vendas, setVendas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resumo, setResumo] = useState({ semanal: 0, mensal: 0 })
  const [produtos, setProdutos] = useState([])

  useEffect(() => {
    fetchVendas()
  }, [])

  const fetchVendas = async () => {
    try {
      setLoading(true)
      const response = await api.get('https://localhost:7223/api/produto')
      const vendasData = response.data

      setVendas(vendasData)
      calcularResumo(vendasData)
      calcularProdutos(vendasData)
    } catch (error) {
      console.error('Erro ao buscar vendas:', error)
      setError('Erro ao carregar vendas. Verifique se a API está rodando.')
    } finally {
      setLoading(false)
    }
  }

  const calcularResumo = (vendasData) => {
    const agora = new Date()
    const vendasSemanais = vendasData.filter((venda) => {
      const dataVenda = new Date(venda.data)
      const diferencaDias = (agora - dataVenda) / (1000 * 60 * 60 * 24)
      return diferencaDias <= 7
    })

    const vendasMensais = vendasData.filter((venda) => {
      const dataVenda = new Date(venda.data)
      const diferencaDias = (agora - dataVenda) / (1000 * 60 * 60 * 24)
      return diferencaDias <= 30
    })

    setResumo({
      semanal: vendasSemanais.length,
      mensal: vendasMensais.length,
    })
  }

  const calcularProdutos = (vendasData) => {
    const produtosMap = {}

    vendasData.forEach((venda) => {
      venda.itens.forEach((item) => {
        if (!produtosMap[item.produtoId]) {
          produtosMap[item.produtoId] = {
            nome: item.produtoNome,
            quantidade: 0,
            total: 0,
          }
        }

        produtosMap[item.produtoId].quantidade += item.quantidade
        produtosMap[item.produtoId].total += item.quantidade * item.preco
      })
    })

    setProdutos(Object.values(produtosMap))
  }

  const calcularTotalGeral = () => {
    return produtos.reduce((total, produto) => total + produto.total, 0)
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
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800">Resumo</h2>
              <p className="text-gray-600">Vendas na última semana: {resumo.semanal}</p>
              <p className="text-gray-600">Vendas nos últimos 30 dias: {resumo.mensal}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800">Produtos Vendidos</h2>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Produto</th>
                    <th className="border border-gray-300 px-4 py-2">Quantidade</th>
                    <th className="border border-gray-300 px-4 py-2">Total Arrecadado</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map((produto) => (
                    <tr key={produto.nome}>
                      <td className="border border-gray-300 px-4 py-2">{produto.nome}</td>
                      <td className="border border-gray-300 px-4 py-2">{produto.quantidade}</td>
                      <td className="border border-gray-300 px-4 py-2">R$ {produto.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="2" className="border border-gray-300 px-4 py-2 font-bold">
                      Total Geral
                    </td>
                    <td className="border border-gray-300 px-4 py-2 font-bold">
                      R$ {calcularTotalGeral().toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Sales