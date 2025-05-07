import React from 'react'
import ProductForm from '../../components/ProductForm'

function Inventory() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Controle de Estoque</h1>
        <ProductForm />
      </div>
    </div>
  )
}

export default Inventory 