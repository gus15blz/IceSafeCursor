import React, { useEffect } from 'react'
import ProductForm from '../../components/ProductForm'

function Inventory() {
  useEffect(() => {
    // Define o zoom para 80% quando o componente monta
    document.body.style.zoom = '80%';

    // Retorna o zoom para 100% quando o componente desmonta
    return () => {
      document.body.style.zoom = '100%';
    };
  }, []);

  return (
    <div className="content-container">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Controle de Estoque</h1>
        <ProductForm />
      </div>
    </div>
  )
}

export default Inventory 