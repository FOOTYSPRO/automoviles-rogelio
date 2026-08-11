"use client";

import { useState } from "react";

export default function SimuladorFinanciacion({ precioTotal }: { precioTotal: number }) {
  const [entrada, setEntrada] = useState(0);
  const [meses, setMeses] = useState(72);
  const TIN = 8.99; // Interés medio en concesionarios

  // Fórmula real de amortización de préstamos
  const calcularCuota = () => {
    const cantidadAFinanciar = precioTotal - entrada;
    if (cantidadAFinanciar <= 0) return 0;
    
    const interesMensual = (TIN / 100) / 12;
    const cuota = cantidadAFinanciar * (interesMensual * Math.pow(1 + interesMensual, meses)) / (Math.pow(1 + interesMensual, meses) - 1);
    
    return cuota.toFixed(2);
  };

  return (
    <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 relative overflow-hidden mt-6">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#111]"></div>
      <h3 className="font-bold text-gray-900 mb-6 text-lg flex items-center">
        <i className="fas fa-calculator text-[#4da359] mr-2"></i> Simulador de Financiación
      </h3>
      
      <div className="space-y-6">
        {/* Rango de Entrada */}
        <div>
          <div className="flex justify-between text-sm font-semibold mb-2">
            <span className="text-gray-600">Entrada inicial</span>
            <span className="text-[#b18b2c]">{entrada.toLocaleString('es-ES')} €</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max={precioTotal} 
            step="500"
            value={entrada} 
            onChange={(e) => setEntrada(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4da359]"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0 €</span>
            <span>{precioTotal.toLocaleString('es-ES')} €</span>
          </div>
        </div>

        {/* Botones de Meses */}
        <div>
          <span className="block text-sm font-semibold text-gray-600 mb-3">Plazo (meses)</span>
          <div className="flex flex-wrap gap-2">
            {[48, 60, 72, 84, 96, 120].map((m) => (
              <button 
                key={m}
                onClick={() => setMeses(m)}
                className={`flex-1 min-w-[60px] py-2 rounded-lg text-sm font-bold border transition ${
                  meses === m 
                  ? 'bg-[#111] text-white border-[#111]' 
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#4da359]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Resultado Destacado */}
        <div className="bg-[#f5f8fc] rounded-xl p-4 flex justify-between items-center border border-blue-50">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Tu cuota estimada</p>
            <p className="text-[10px] text-gray-400 mt-0.5">TIN: {TIN}% | A financiar: {(precioTotal - entrada).toLocaleString('es-ES')} €</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-extrabold text-[#111]">{calcularCuota()}<span className="text-base font-medium text-gray-500">/mes</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}