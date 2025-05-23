import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { finalizarVenda } from '../../services/api';

function Sales() {
  // Pega as vendas do contexto
  const { vendas } = useCart();

  /**
   * Calcula o total de uma venda
   * @param {Array} itens - Array de itens da venda
   * @returns {number} - Total da venda
   */
  const calcularTotal = (itens) => {
    return itens.reduce((total, item) => 
      total + (item.preco * item.quantidade), 0
    );
  };

  /**
   * Formata valor para moeda brasileira
   * @param {number} valor - Valor numérico
   * @returns {string} - Valor formatado
   */
  const formatarMoeda = (valor) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <div className="sales-page p-6">
      <h2 className="text-2xl font-bold mb-4">Histórico de Vendas</h2>
      
      {vendas.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhuma venda registrada ainda.</p>
          <p className="text-sm text-gray-400">
            As vendas aparecerão aqui após finalizar compras no carrinho.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {vendas.map((venda) => (
            <div key={venda.id} className="border rounded-lg p-4 bg-white shadow">
              {/* Cabeçalho da Venda */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Venda #{venda.id}</h3>
                <span className="text-sm text-gray-500">
                  {venda.data} às {venda.hora}
                </span>
              </div>
              
              {/* Itens da Venda */}
              <div className="mb-3">
                <h4 className="font-medium mb-2">Itens vendidos:</h4>
                {venda.itens.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm py-1">
                    <span>{item.nome} (x{item.quantidade})</span>
                    <span>{formatarMoeda(item.preco * item.quantidade)}</span>
                  </div>
                ))}
              </div>
              
              {/* Total da Venda */}
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold">
                  <span>Total da Venda:</span>
                  <span>{formatarMoeda(venda.total)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Sales;
