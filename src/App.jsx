import { useState } from 'react'
import axios from 'axios'
import './App.css'
import Home from './pages/Home'
import Inventory from './pages/Inventory'
import Sales from './pages/Sales'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />
      case 'inventory':
        return <Inventory />
      case 'sales':
        return <Sales />
      default:
        return <Home />
    }
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#c4e4f7' }}>
      {/* Navegação */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex space-x-4">
            <button 
              onClick={() => setCurrentPage('home')}
              className={`px-4 py-2 rounded ${currentPage === 'home' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
            >
              Início
            </button>
            <button 
              onClick={() => setCurrentPage('inventory')}
              className={`px-4 py-2 rounded ${currentPage === 'inventory' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
            >
              Estoque
            </button>
            <button 
              onClick={() => setCurrentPage('sales')}
              className={`px-4 py-2 rounded ${currentPage === 'sales' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
            >
              Vendas
            </button>
          </div>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderPage()}
      </main>

      {/* Rodapé */}
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center">&copy; 2024 Meu Site. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
