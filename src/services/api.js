import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5005',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Produtos
export const getProdutos = () => api.get('/api/produto');
export const getProdutoById = (id) => api.get(`/api/produto/${id}`);
export const createProduto = (produto) => api.post('/api/produto', produto);
export const updateProduto = (id, produto) => api.put(`/api/produto/${id}`, produto);
export const deleteProduto = (id) => api.delete(`/api/produto/${id}`);

// Vendas
export const registrarVenda = (venda) => api.post('/api/venda', venda);
export const getVendas = () => api.get('/api/venda');
export const atualizarEstoque = (produtoId, novoEstoque) => {
  return api.put(`/api/produto/${produtoId}/estoque`, { estoque: novoEstoque });
};

// Interceptors para logs
api.interceptors.request.use(request => {
  console.log('🚀 Request:', {
    url: request.url,
    method: request.method,
    data: request.data
  });
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('✅ Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('❌ Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default api; 