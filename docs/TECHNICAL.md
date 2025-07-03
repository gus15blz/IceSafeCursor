# Documentação Técnica - Ice Safe

## 📁 Estrutura do Código

### Componente Sales (src/pages/Sales/index.jsx)

#### Estados (States)
```javascript
const [, setVendas] = useState([])              // Estado para armazenar todas as vendas
const [loading, setLoading] = useState(false)    // Estado para controlar loading
const [error, setError] = useState('')          // Estado para mensagens de erro
const [resumo, setResumo] = useState({          // Estado para resumo de vendas
  semanal: 0,                                   // Total de vendas na semana
  mensal: 0,                                    // Total de vendas no mês
  totalGeral: 0,                                // Total geral de vendas
  totalSemanal: 0,                              // Valor total das vendas semanais
  totalMensal: 0                                // Valor total das vendas mensais
})
const [produtos, setProdutos] = useState([])     // Estado para lista de produtos
const [vendas, setVendasState] = useState([])    // Estado para vendas filtradas
const [dataInicio, setDataInicio] = useState('') // Estado para data inicial do filtro
const [dataFim, setDataFim] = useState('')       // Estado para data final do filtro
const [vendasFiltradas, setVendasFiltradas] = useState([]) // Estado para vendas após filtro
const [showProdutosModal, setShowProdutosModal] = useState(false) // Estado para controlar modal
```

#### Funções Principais

##### 1. fetchVendas()
```javascript
const fetchVendas = async () => {
  // Função para buscar vendas da API
  // Retorna: Array de vendas
  // Efeitos: Atualiza estados de vendas, resumo e produtos
}
```

##### 2. filtrarPorData()
```javascript
const filtrarPorData = () => {
  // Função para filtrar vendas por período
  // Parâmetros: Usa estados dataInicio e dataFim
  // Retorna: Array de vendas filtradas
  // Efeitos: Atualiza vendasFiltradas, resumo e produtos
}
```

##### 3. finalizarCompra()
```javascript
const finalizarCompra = async () => {
  // Função para finalizar uma compra
  // Parâmetros: Usa o estado cart do contexto
  // Retorna: Status da operação
  // Efeitos: Limpa o carrinho após sucesso
}
```

##### 4. calcularResumo()
```javascript
const calcularResumo = (vendasData) => {
  // Função para calcular resumo de vendas
  // Parâmetros: Array de vendas
  // Retorna: Objeto com totais (semanal, mensal, geral)
  // Efeitos: Atualiza o estado resumo
}
```

##### 5. calcularProdutos()
```javascript
const calcularProdutos = (vendasData) => {
  // Função para calcular quantidade de produtos vendidos
  // Parâmetros: Array de vendas
  // Retorna: Array de produtos com quantidades
  // Efeitos: Atualiza o estado produtos
}
```

##### 6. formatarMoeda()
```javascript
const formatarMoeda = (valor) => {
  // Função para formatar valores monetários
  // Parâmetros: número
  // Retorna: string formatada em BRL
}
```

#### Efeitos (useEffect)
```javascript
useEffect(() => {
  // Efeito para configuração inicial
  // Ações:
  // 1. Ajusta zoom da página para 60%
  // 2. Busca vendas iniciais
  // 3. Restaura zoom ao desmontar componente
}, [])
```

#### Contexto Utilizado
```javascript
const { cart, clearCart } = useCart();
// Contexto do carrinho de compras
// cart: Array de itens no carrinho
// clearCart: Função para limpar o carrinho
```

## 🔄 Fluxo de Dados

1. **Inicialização**
   - Componente monta
   - useEffect dispara
   - fetchVendas é chamado
   - Estados são populados

2. **Filtragem**
   - Usuário seleciona datas
   - filtrarPorData é chamado
   - Estados são atualizados

3. **Finalização de Compra**
   - Usuário confirma compra
   - finalizarCompra é chamado
   - API é consultada
   - Carrinho é limpo

## 📊 Estrutura de Dados

### Objeto Venda
```javascript
{
  produtoId: number,    // ID do produto
  quantidade: number,   // Quantidade vendida
  preco: number,        // Preço unitário
  dataVenda: string,    // Data da venda
  valorTotal: number    // Valor total da venda
}
```

### Objeto Resumo
```javascript
{
  semanal: number,      // Total de vendas na semana
  mensal: number,       // Total de vendas no mês
  totalGeral: number,   // Total geral de vendas
  totalSemanal: number, // Valor total semanal
  totalMensal: number   // Valor total mensal
}
```

## 🎨 Interface

### Componentes Visuais
1. **Filtro de Datas**
   - Input data início
   - Input data fim
   - Botão filtrar
   - Botão limpar

2. **Resumo**
   - Cards com totais
   - Valores formatados

3. **Modal de Produtos**
   - Tabela de produtos
   - Quantidades
   - Botão de fechar

4. **Tabela de Vendas**
   - Cabeçalho fixo
   - Rolagem vertical
   - Rodapé com total 