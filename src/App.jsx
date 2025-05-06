import { useState } from 'react'
import './App.css'

function App() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#c4e4f7' }}>
      {/* Cabeçalho */}
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Meu Site</h1>
        </nav>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="rounded-lg shadow-md p-6 h-full" style={{ backgroundColor: '#3192ca' }}>
          <h2 className="text-xl font-semibold mb-4 text-white">Bem-vindo ao Meu Site</h2>
          <p className="text-white">
            Este é um site criado com React e TailwindCSS. Aqui você pode adicionar seu conteúdo.
          </p>
        </section>
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
