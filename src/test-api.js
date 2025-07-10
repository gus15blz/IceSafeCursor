import api from './services/api.js';

// Teste de conexão com a API
export const testApiConnection = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    console.error('Erro ao testar conexão:', error);
    throw error;
  }
};

// Teste de listagem de produtos
export const testListProducts = async () => {
  try {
    const response = await api.get('/api/Produto');
    return response.data;
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    throw error;
  }
};

// Teste de criação de produto
export const testCreateProduct = async () => {
  try {
    const testProduct = {
      nome: "Produto Teste",
      preco: 10.99,
      quantidade: 100
    };

    const response = await api.post('/api/Produto', testProduct);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    throw error;
  }
};

// Bloco para rodar o teste automaticamente se chamado via node
if (import.meta.url === `file://${process.cwd().replace(/\\/g, '/')}/src/test-api.js`) {
  testCreateProduct()
    .then(res => {
      console.log('Produto de teste cadastrado com sucesso:', res);
      process.exit(0);
    })
    .catch(err => {
      console.error('Erro ao cadastrar produto de teste:', err);
      process.exit(1);
    });
} 