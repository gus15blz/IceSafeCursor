import axios from 'axios';

async function testApi() {
  try {
    console.log('Testando conexão com a API...');
    
    // Teste GET
    const getResponse = await axios.get('http://localhost:7223/api/Produto', {
      headers: {
        'Accept': 'application/json'
      }
    });
    console.log('GET /api/Produto - Status:', getResponse.status);
    console.log('Dados recebidos:', getResponse.data);

    // Teste POST
    const postData = {
      nome: "Teste",
      preco: 10.99,
      quantidade: 1,
      imgLink: "https://exemplo.com/imagem.jpg"
    };

    const postResponse = await axios.post('http://localhost:7223/api/Produto', postData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    console.log('POST /api/Produto - Status:', postResponse.status);
    console.log('Resposta:', postResponse.data);

  } catch (error) {
    console.error('Erro no teste:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    });
  }
}

testApi(); 