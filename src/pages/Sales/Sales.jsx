import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Sales() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Função para buscar dados da API
    const fetchSalesData = async () => {
      try {
        const response = await axios.get('https://localhost:7223'); // Substitua pela URL da sua API
        setSalesData(response.data);
      } catch (err) {
        setError('Erro ao carregar os dados de vendas.');
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  if (loading) {
    return <p>Carregando dados de vendas...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="sales-page">
      <h2 className="text-2xl font-bold">Página de Vendas</h2>
      <p>Bem-vindo à página de vendas. Aqui você pode gerenciar suas vendas.</p>
      <ul>
        {salesData.map((sale) => (
          <li key={sale.id}>
            <p>Produto: {sale.productName}</p>
            <p>Quantidade: {sale.quantity}</p>
            <p>Preço: R$ {sale.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sales;