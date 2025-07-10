# Documentação Arquitetural - Ice Safe

## 📋 Requisitos do Sistema

### Requisitos Mínimos
- Node.js 16.x ou superior
- NPM 7.x ou superior
- Navegador moderno com suporte a ES6+
- Conexão com internet para API

### Dependências Principais
```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "axios": "^1.x",
    "bootstrap": "5.3.3"
  }
}
```

## 🏗️ Estrutura do Projeto

```
src/
├── contexts/           # Contextos React
│   └── CartContext.js  # Gerenciamento do carrinho
├── pages/             # Componentes de página
│   └── Sales/         # Página de vendas
├── services/          # Serviços e configurações
│   └── api.js         # Configuração do Axios
└── main.jsx           # Ponto de entrada
```

## 💻 Linguagens e Tecnologias

### Frontend
- **React**: Biblioteca principal
- **JavaScript/JSX**: Linguagem de programação
- **CSS/Tailwind**: Estilização
- **Bootstrap**: Framework UI

### Backend (API)
- **REST**: Arquitetura da API
- **JSON**: Formato de dados

## 📊 Estruturas de Dados

### 1. Contexto do Carrinho (CartContext)
```typescript
interface CartItem {
  id: number;
  quantidadeNoCarrinho: number;
  quantidade?: number;
  preco: number;
}

interface CartContextType {
  cart: CartItem[];
  clearCart: () => void;
  // ... outros métodos
}
```

### 2. Venda
```typescript
interface Venda {
  produtoId: number;
  quantidade: number;
  preco: number;
  dataVenda: string;
  valorTotal: number;
}
```

### 3. Resumo
```typescript
interface Resumo {
  semanal: number;
  mensal: number;
  totalGeral: number;
  totalSemanal: number;
  totalMensal: number;
}
```

## 🔄 Métodos e Funções

### 1. Componente Sales

#### Estados
```typescript
// Estados de Dados
const [vendas, setVendas] = useState<Venda[]>([]);
const [vendasFiltradas, setVendasFiltradas] = useState<Venda[]>([]);
const [produtos, setProdutos] = useState<Produto[]>([]);

// Estados de UI
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<string>('');
const [showProdutosModal, setShowProdutosModal] = useState<boolean>(false);

// Estados de Filtro
const [dataInicio, setDataInicio] = useState<string>('');
const [dataFim, setDataFim] = useState<string>('');

// Estado de Resumo
const [resumo, setResumo] = useState<Resumo>({
  semanal: 0,
  mensal: 0,
  totalGeral: 0,
  totalSemanal: 0,
  totalMensal: 0
});
```

#### Métodos Principais

##### fetchVendas()
```typescript
async function fetchVendas(): Promise<void> {
  // Requisitos:
  // - API endpoint: GET /api/Venda
  // - Retorno esperado: Array<Venda>
  // - Tratamento de erros necessário
}
```

##### filtrarPorData()
```typescript
function filtrarPorData(): void {
  // Requisitos:
  // - dataInicio: string (YYYY-MM-DD)
  // - dataFim: string (YYYY-MM-DD)
  // - vendas: Array<Venda>
  // - Retorno: void (atualiza estados)
}
```

##### finalizarCompra()
```typescript
async function finalizarCompra(): Promise<void> {
  // Requisitos:
  // - cart: Array<CartItem>
  // - API endpoint: POST /api/vendas
  // - Payload: { itens: Array<{ produtoId, quantidade, preco }> }
  // - Tratamento de erros necessário
}
```

##### calcularResumo()
```typescript
function calcularResumo(vendasData: Venda[]): void {
  // Requisitos:
  // - vendasData: Array<Venda>
  // - Retorno: void (atualiza estado resumo)
  // - Cálculos: semanal, mensal, totalGeral
}
```

##### calcularProdutos()
```typescript
function calcularProdutos(vendasData: Venda[]): void {
  // Requisitos:
  // - vendasData: Array<Venda>
  // - Retorno: void (atualiza estado produtos)
  // - Agrupamento por produtoId
}
```

##### formatarMoeda()
```typescript
function formatarMoeda(valor: number): string {
  // Requisitos:
  // - valor: number
  // - Retorno: string (formato BRL)
  // - Locale: pt-BR
}
```

### 2. Efeitos (useEffect)

```typescript
useEffect(() => {
  // Requisitos:
  // - Execução: montagem do componente
  // - Ações: 
  //   1. Ajuste de zoom
  //   2. Busca inicial de vendas
  //   3. Limpeza ao desmontar
}, []);
```

## 🔌 Integrações

### 1. API
```typescript
interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: {
    'Content-Type': string;
    // ... outros headers
  };
}

// Endpoints
const endpoints = {
  vendas: {
    listar: '/api/Venda',
    criar: '/api/vendas'
  }
};
```

### 2. Contexto do Carrinho
```typescript
// Integração com CartContext
const { cart, clearCart } = useCart();
```

## 🎨 Componentes de UI

### 1. Filtro de Datas
```typescript
interface FiltroDatasProps {
  dataInicio: string;
  dataFim: string;
  onDataInicioChange: (data: string) => void;
  onDataFimChange: (data: string) => void;
  onFiltrar: () => void;
  onLimpar: () => void;
}
```

### 2. Modal de Produtos
```typescript
interface ModalProdutosProps {
  show: boolean;
  onClose: () => void;
  produtos: Array<{
    produtoId: number;
    quantidade: number;
  }>;
}
```

### 3. Tabela de Vendas
```typescript
interface TabelaVendasProps {
  vendas: Venda[];
  loading: boolean;
  error: string;
}
```

## 🔒 Segurança e Validação

### 1. Validação de Dados
```typescript
// Validações necessárias
interface Validacoes {
  data: (data: string) => boolean;
  quantidade: (qtd: number) => boolean;
  preco: (preco: number) => boolean;
}
```

### 2. Tratamento de Erros
```typescript
interface ErrorHandler {
  api: (error: any) => void;
  validacao: (error: any) => void;
  ui: (error: any) => void;
}
```

## 📈 Fluxo de Dados

1. **Inicialização**
   ```mermaid
   graph TD
   A[Componente Monta] --> B[useEffect]
   B --> C[fetchVendas]
   C --> D[Atualiza Estados]
   ```

2. **Filtragem**
   ```mermaid
   graph TD
   A[Usuário Seleciona Datas] --> B[filtrarPorData]
   B --> C[Filtra Vendas]
   C --> D[Atualiza Estados]
   ```

3. **Finalização de Compra**
   ```mermaid
   graph TD
   A[Usuário Confirma] --> B[finalizarCompra]
   B --> C[API]
   C --> D[Limpa Carrinho]
   ``` 