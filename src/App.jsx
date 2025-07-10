import React from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Sales from './pages/Sales'
import ProductForm from './components/ProductForm'
import { CartProvider, useCart } from './contexts/CartContext'
import './App.css'
import Inventory from './pages/Inventory'
import CartModal from './components/CartModal'
import PasswordModal from './components/PasswordModal'
import logo from './images/logo.png'
import carrinhoIcon from './images/carrinho.png'

// Componente de Navegação separado para usar os hooks do router
function Navigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isCartOpen, setIsCartOpen } = useCart()
  const [isInventoryPasswordModalOpen, setIsInventoryPasswordModalOpen] = React.useState(false)
  const [isSalesPasswordModalOpen, setIsSalesPasswordModalOpen] = React.useState(false)

  const handleInventoryAccess = () => {
    setIsInventoryPasswordModalOpen(true)
  }

  const handleSalesAccess = () => {
    setIsSalesPasswordModalOpen(true)
  }

  const handleInventoryPasswordSuccess = () => {
    navigate('/estoque')
    setIsInventoryPasswordModalOpen(false)
  }

  const handleSalesPasswordSuccess = () => {
    navigate('/vendas')
    setIsSalesPasswordModalOpen(false)
  }

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50 w-full">
        <div className="nav-container">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img 
                src={logo} 
                alt="Ice Safe Logo" 
                className="nav-logo cursor-pointer"
                onClick={() => navigate('/')}
              />
              <h1 className="text-xl font-bold text-gray-800">Ice Safe</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => navigate('/')}
                className={`nav-button rounded-lg transition-colors ${
                  location.pathname === '/' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Início
              </button>
              <button 
                onClick={handleInventoryAccess}
                className={`nav-button rounded-lg transition-colors ${
                  location.pathname === '/estoque' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Estoque
              </button>
              <button 
                onClick={handleSalesAccess}
                className={`nav-button rounded-lg transition-colors ${
                  location.pathname === '/vendas' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Vendas
              </button>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
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

      {/* Modal do Carrinho */}
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />

      {/* Modal de Senha para Estoque */}
      <PasswordModal
        isOpen={isInventoryPasswordModalOpen}
        onClose={() => setIsInventoryPasswordModalOpen(false)}
        onSuccess={handleInventoryPasswordSuccess}
      />

      {/* Modal de Senha para Vendas */}
      <PasswordModal
        isOpen={isSalesPasswordModalOpen}
        onClose={() => setIsSalesPasswordModalOpen(false)}
        onSuccess={handleSalesPasswordSuccess}
      />
    </>
  )
}

// Layout padrão que inclui a navegação
function DefaultLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#c4e4f7' }}>
      <Navigation />
      <main className="flex-grow w-full">
        <div className="content-container">
          {children}
        </div>
      </main>
      <footer className="footer bg-white border-t text-gray-600 w-full">
        <div className="content-container">
          <p className="text-center">&copy; 2024 Ice Safe. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

// Componente principal
function MainApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <DefaultLayout>
            <Home />
          </DefaultLayout>
        } />
        <Route path="/estoque" element={
          <DefaultLayout>
            <Inventory />
          </DefaultLayout>
        } />
        <Route path="/vendas" element={
          <DefaultLayout>
            <Sales />
          </DefaultLayout>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

// Componente App que envolve tudo com o CartProvider
function App() {
  return (
    <CartProvider>
      <MainApp />
    </CartProvider>
  )
}

export default App
