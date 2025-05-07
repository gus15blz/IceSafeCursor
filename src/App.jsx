import { useState } from 'react'
import axios from 'axios'
import './App.css'
import Home from './pages/Home'
import Inventory from './pages/Inventory'
import Sales from './pages/Sales'
import CartModal from './components/CartModal'
import PasswordModal from './components/PasswordModal'
import logo from './images/logo.png'
import carrinhoIcon from './images/carrinho.png'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

  const handleInventoryAccess = () => {
    setIsPasswordModalOpen(true)
  }

  const handlePasswordSuccess = () => {
    setCurrentPage('inventory')
  }

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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#c4e4f7' }}>
      {/* Navegação */}
      <nav className="bg-white shadow-md sticky top-0 z-50 w-full">
        <div className="nav-container">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img 
                src={logo} 
                alt="Ice Safe Logo" 
                className="nav-logo"
              />
              <h1 className="text-xl font-bold text-gray-800">Ice Safe</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setCurrentPage('home')}
                className={`nav-button rounded-lg transition-colors ${
                  currentPage === 'home' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Início
              </button>
              <button 
                onClick={handleInventoryAccess}
                className={`nav-button rounded-lg transition-colors ${
                  currentPage === 'inventory' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Estoque
              </button>
              <button 
                onClick={() => setCurrentPage('sales')}
                className={`nav-button rounded-lg transition-colors ${
                  currentPage === 'sales' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Vendas
              </button>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <img 
                  src={carrinhoIcon} 
                  alt="Carrinho" 
                  className="h-6 w-auto"
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main className="flex-grow w-full">
        <div className="content-container">
          {renderPage()}
        </div>
      </main>

      {/* Rodapé */}
      <footer className="footer bg-gray-800 text-white w-full">
        <div className="content-container">
          <p className="text-center">&copy; 2024 Ice Safe. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Modal do Carrinho */}
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />

      {/* Modal de Senha */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={handlePasswordSuccess}
      />
    </div>
  )
}

export default App
