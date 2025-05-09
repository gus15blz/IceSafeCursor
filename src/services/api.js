import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7223/',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  maxContentLength: 50 * 1024 * 1024,
  maxBodyLength: 50 * 1024 * 1024,
  validateStatus: function (status) {
    return status >= 200 && status < 500;
  }
});

// Interceptor para logs de requisição
api.interceptors.request.use(request => {
  console.log('🚀 Iniciando requisição:', {
    url: request.url,
    method: request.method,
    headers: request.headers,
    data: request.data,
    baseURL: request.baseURL,
    fullURL: `${request.baseURL}${request.url}`
  });
  return request;
});

// Interceptor para logs de resposta
api.interceptors.response.use(
  response => {
    console.log('✅ Resposta recebida:', {
      status: response.status,
      data: response.data,
      headers: response.headers,
      url: response.config.url,
      fullURL: `${response.config.baseURL}${response.config.url}`
    });
    return response;
  },
  error => {
    console.error('❌ Erro na requisição:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'URL não disponível',
        method: error.config?.method,
        headers: error.config?.headers,
        data: error.config?.data
      }
    });

    // Tratamento específico para erros comuns
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Timeout: A requisição demorou muito para responder');
    } else if (!error.response) {
      console.error('🔌 Erro de conexão: Não foi possível conectar com a API');
    } else if (error.response.status === 404) {
      console.error('🔍 Endpoint não encontrado');
    } else if (error.response.status === 500) {
      console.error('💥 Erro interno do servidor');
    }

    return Promise.reject(error);
  }
);

export default api; 