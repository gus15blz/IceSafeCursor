import axios from 'axios';

async function testApi() {
  try {
    console.log('🔍 Iniciando teste de conexão com a API...');
    
    // Teste 1: Verificar se a API está respondendo
    console.log('\n📡 Teste 1: Verificando conexão básica...');
    try {
      const response = await axios.get('http://localhost:7223', {
        timeout: 5000
      });
      console.log('✅ API está respondendo:', response.status);
    } catch (error) {
      console.error('❌ Erro na conexão básica:', error.message);
    }

    // Teste 2: Tentar GET com headers específicos
    console.log('\n📡 Teste 2: Tentando GET com headers específicos...');
    try {
      const response = await axios.get('http://localhost:7223/api/Produto', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });
      console.log('✅ GET /api/Produto - Status:', response.status);
      console.log('📦 Dados recebidos:', response.data);
    } catch (error) {
      console.error('❌ Erro no GET:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status
      });
    }

    // Teste 3: Tentar POST
    console.log('\n📡 Teste 3: Tentando POST...');
    try {

      const response = await axios.post('https://localhost:7223/api/Produto',  {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 5000
      });
      console.log('✅ POST /api/Produto - Status:', response.status);
      console.log('📦 Resposta:', response.data);
    } catch (error) {
      console.error('❌ Erro no POST:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status
      });
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testApi(); 