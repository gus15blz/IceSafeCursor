import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7223',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});
/*
const handleFinalizar = async () => {
  try {
    await finalizarCompra(carrinho);
    alert("Compra finalizada com sucesso!");
    // Atualizar estoque, limpar carrinho, etc.
  } catch (error) {
    alert("Erro ao finalizar compra.");
  }
};
*/
// Produtos
export const getProdutos = () => api.get('/api/produto');
export const getProdutoById = (id) => api.get(`/api/produto/${id}`);
export const createProduto = (produto) => api.post('/api/produto', produto);
export const updateProduto = (id, produto) => api.put(`/api/produto/${id}`, produto);
export const deleteProduto = (id) => api.delete(`/api/produto/${id}`);

// Funções do Histórico de Vendas
export const getVendas = async () => {
  try {
    console.log('Iniciando busca de vendas...');
    const response = await api.get('/api/HistoricoVendas');
    console.log('Resposta da API (getVendas):', response);
    return response;
  } catch (error) {
    console.error('Erro detalhado ao buscar vendas:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    throw error;
  }
};

export const getVendaPorId = async (id) => {
  try {
    const response = await api.get(`/api/HistoricoVendas/${id}`);
    console.log('Resposta da API (getVendaPorId):', response.data);
    return response;
  } catch (error) {
    console.error('Erro ao buscar venda específica:', error);
    throw error;
  }
};

export const getVendasPorPeriodo = async (dataInicio, dataFim) => {
  try {
    console.log('Buscando vendas por período:', { dataInicio, dataFim });
    const params = new URLSearchParams({
      dataInicio: dataInicio.toISOString().split('T')[0],
      dataFim: dataFim.toISOString().split('T')[0]
    });
    const response = await api.get(`/api/HistoricoVendas/pordata?${params}`);
    console.log('Resposta da API (getVendasPorPeriodo):', response);
    return response;
  } catch (error) {
    console.error('Erro detalhado ao buscar vendas por período:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    throw error;
  }
};

export const getResumoVendas = async () => {
  try {
    console.log('Buscando resumo de vendas...');
    const response = await api.get('/api/HistoricoVendas/resumo');
    console.log('Resposta da API (getResumoVendas):', response);
    return response;
  } catch (error) {
    console.error('Erro detalhado ao buscar resumo:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    throw error;
  }
};

// Função para buscar relatório
export const getRelatorioVendas = async () => {
  try {
    const response = await api.get('/api/HistoricoVendas/relatorio');
    console.log('Resposta da API (getRelatorioVendas):', response.data);
    return response;
  } catch (error) {
    console.error('Erro detalhado ao buscar relatório:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

// Interceptors para logs detalhados
api.interceptors.request.use(request => {
  console.log('>>> Requisição:', {
    method: request.method?.toUpperCase(),
    url: request.url,
    data: request.data,
    headers: request.headers,
    params: request.params
  });
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('<<< Resposta:', {
      status: response.status,
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  error => {
    if (error.response) {
      console.error('!!! Erro na resposta:', {
        status: error.response.status,
        method: error.config.method?.toUpperCase(),
        url: error.config.url,
        data: error.response.data,
        message: error.message
      });
    } else {
      console.error('!!! Erro na requisição:', {
        message: error.message,
        config: error.config
      });
    }
    return Promise.reject(error);
  }
);

// Cadastrar venda
export const finalizarCompra = async (venda) => {
  try {
    console.log('Dados da venda a serem enviados:', venda);
    const response = await api.post('/api/HistoricoVendas', venda);
    console.log('Resposta da API (finalizarCompra):', response);
    return response.data;
  } catch (error) {
    console.error('Erro detalhado ao finalizar compra:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
      dadosEnviados: venda
    });
    throw error;
  }
};

// Função para registrar venda na tabela correta
export const finalizarVenda = async (venda) => {
  try {
    console.log('Dados da venda a serem enviados:', venda);
    const response = await api.post('/api/Venda', venda);
    console.log('Resposta da API (finalizarVenda):', response);
    return response.data;
  } catch (error) {
    console.error('Erro detalhado ao registrar venda:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
      dadosEnviados: venda
    });
    throw error;
  }
};

export default api; 