"use client"; // Esta directiva es necesaria porque usamos estados y formularios interactivos

import { useState } from 'react';
import { db } from "../../lib/firebase";
import { collection, addDoc } from 'firebase/firestore';

export default function AdminPanel() {
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMsg('Guardando...');

    const formData = new FormData(e.currentTarget);

    try {
      await addDoc(collection(db, "vehiculos"), {
        brand: formData.get('brand'),
        model: formData.get('model'),
        price: Number(formData.get('price')),
        year: Number(formData.get('year')),
        km: formData.get('km'),
        kmNum: Number((formData.get('km') as string).replace(/\./g, '')), // Extrae el número para ordenar
        fuel: formData.get('fuel'),
        transmission: formData.get('transmission'),
        image: formData.get('image'),
        tag: formData.get('tag'),
        tagColor: 'bg-brand-orange',
        description: formData.get('description')
      });
      
      setMsg('✅ ¡Vehículo guardado correctamente en Firebase!');
      (e.target as HTMLFormElement).reset(); // Limpiar el formulario
    } catch (error: any) {
      console.error(error);
      setMsg('❌ Error al guardar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#1E3A8A]">
        <h1 className="text-3xl font-bold mb-6 text-[#1E3A8A]">Añadir Nuevo Vehículo</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="brand" type="text" placeholder="Marca (ej. Audi)" required className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#EA580C]" />
            <input name="model" type="text" placeholder="Modelo (ej. A3 Sportback)" required className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#EA580C]" />
            <input name="price" type="number" placeholder="Precio (€)" required className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#EA580C]" />
            <input name="year" type="number" placeholder="Año (ej. 2021)" required className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#EA580C]" />
            <input name="km" type="text" placeholder="Kilómetros (ej. 55.000)" required className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#EA580C]" />
            <select name="fuel" required className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#EA580C] bg-white">
                <option value="">Combustible...</option>
                <option value="Diésel">Diésel</option>
                <option value="Gasolina">Gasolina</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Eléctrico">Eléctrico</option>
            </select>
            <select name="transmission" required className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#EA580C] bg-white">
                <option value="">Transmisión...</option>
                <option value="Manual">Manual</option>
                <option value="Automático">Automático</option>
            </select>
            <input name="tag" type="text" placeholder="Etiqueta (ej. Ocasión, ECO)" className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#EA580C]" />
          </div>
          
          <input name="image" type="url" placeholder="URL de la Foto Principal (ej. https://...)" required className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:border-[#EA580C]" />
          
          <textarea name="description" placeholder="Descripción detallada del estado, mantenimientos, extras..." required className="border border-gray-300 p-3 rounded-lg w-full h-32 focus:outline-none focus:border-[#EA580C]"></textarea>
          
          <button type="submit" disabled={loading} className="w-full bg-[#1E3A8A] text-white font-bold py-4 rounded-lg hover:bg-blue-900 transition-colors disabled:bg-gray-400">
            {loading ? 'Subiendo datos...' : 'Guardar Vehículo en Catálogo'}
          </button>
        </form>
        
        {msg && <p className="mt-6 text-center font-medium text-lg">{msg}</p>}
      </div>
    </div>
  );
}