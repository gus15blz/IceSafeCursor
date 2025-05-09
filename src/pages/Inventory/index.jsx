import React from 'react'
import ProductForm from '../../components/ProductForm'

function Inventory() {
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