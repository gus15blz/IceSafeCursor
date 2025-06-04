import React, { useEffect } from 'react'
import ProductForm from '../../components/ProductForm'

function Inventory() {
  useEffect(() => {
    document.body.style.zoom = '70%';
    return () => {
      document.body.style.zoom = '100%';
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Controle de Estoque</h1>
        <ProductForm />
      </section>
    </div>
  )
}

export default Inventory 