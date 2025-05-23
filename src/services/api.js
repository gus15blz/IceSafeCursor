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

// Função para buscar vendas
export const getVendas = () => api.get('/api/Vendas/Vendas');

// Função para buscar relatório
export const getRelatorioVendas = () => api.get('/api/Vendas/relatorio');

// Interceptors para logs detalhados
api.interceptors.request.use(request => {
  const { method, url, data } = request;
  console.log(`>>> ${method?.toUpperCase()} ${url}`, data ? JSON.stringify(data, null, 2) : '');
  return request;
});

api.interceptors.response.use(
  response => {
    const { status, config: { url, method }, data } = response;
    console.log(`<<< ${status} ${method?.toUpperCase()} ${url}`, JSON.stringify(data, null, 2));
    return response;
  },
  error => {
    if (error.response) {
      const { status, config: { url, method }, data } = error.response;
      console.error(`!!! ${status} ${method?.toUpperCase()} ${url}`, JSON.stringify(data, null, 2));
    }
    return Promise.reject(error);
  }
);

export default api; 