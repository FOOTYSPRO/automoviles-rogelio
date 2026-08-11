"use client";

import { useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Link from "next/link";

export default function AdminPanel() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  // Estado para los datos del texto
  const [formData, setFormData] = useState({
    brand: "", model: "", price: "", year: "", km: "",
    fuel: "", transmission: "", tag: "", description: ""
  });

  // Estado para las fotos
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: any) => {
    const selectedFiles = Array.from(e.target.files) as File[];
    setFiles(selectedFiles);
    
    // Generar previsualizaciones locales al instante
    const filePreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(filePreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "Subiendo fotos y datos, no cierres la ventana...", type: "loading" });

    try {
      const imageUrls = [];

      // 1. Subir cada foto a Firebase Storage y obtener su enlace real
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Crear ruta única en el Storage (ej: vehiculos/1690000_Audi_A3.jpg)
        const storageRef = ref(storage, `vehiculos/${Date.now()}_${file.name.replace(/\s/g, "_")}`);
        
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        imageUrls.push(downloadUrl);
      }

      // 2. Guardar todos los datos del coche en la base de datos
      const docData = {
        ...formData,
        price: Number(formData.price),
        year: Number(formData.year),
        km: formData.km.toString(), // Forzamos que sea texto para que no falle luego
        image: imageUrls[0] || "",  // La primera foto es la de portada (compatibilidad)
        images: imageUrls,          // El array completo con todas las fotos
        createdAt: new Date()
      };

      await addDoc(collection(db, "vehiculos"), docData);

      setMessage({ text: "¡Vehículo publicado con éxito en el catálogo!", type: "success" });
      
      // Limpiar formulario
      setFormData({
        brand: "", model: "", price: "", year: "", km: "",
        fuel: "", transmission: "", tag: "", description: ""
      });
      setFiles([]);
      setPreviews([]);

    } catch (error: any) {
      console.error(error);
      setMessage({ text: "Error al subir: " + error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      
      {/* BARRA LATERAL (Dashboard Vibe) */}
      <aside className="w-64 bg-[#111] text-white flex flex-col shadow-2xl hidden md:flex">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-extrabold text-[#4da359] uppercase tracking-wide">Admin Panel</h2>
          <p className="text-xs text-gray-400 mt-1">Automóviles Rogelio</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="block bg-[#4da359] text-white px-4 py-3 rounded-lg font-medium shadow">
            <i className="fas fa-plus-circle mr-2"></i> Nuevo Vehículo
          </Link>
          <Link href="/#catalogo" className="block text-gray-400 hover:text-white px-4 py-3 rounded-lg font-medium transition">
            <i className="fas fa-car mr-2"></i> Ver Catálogo
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800 text-xs text-center text-gray-500">
          v2.0 Premium
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Añadir Vehículo</h1>
            <p className="text-gray-500 mt-2">Rellena los detalles y sube hasta 10 fotos. Se publicará automáticamente.</p>
          </div>

          {message.text && (
            <div className={`p-4 rounded-xl mb-8 font-medium ${
              message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
              message.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
              'bg-blue-100 text-blue-800 border border-blue-200 animate-pulse'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            
            {/* SECCIÓN 1: FOTOS (Drag & Drop visual) */}
            <div className="p-8 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900 mb-4"><i className="far fa-images text-[#4da359] mr-2"></i> Galería de Fotos</h3>
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl bg-white hover:border-[#4da359] transition cursor-pointer relative">
                <div className="space-y-1 text-center">
                  <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#4da359] hover:text-green-600 focus-within:outline-none">
                      <span>Seleccionar archivos desde el equipo</span>
                      <input id="file-upload" type="file" multiple accept="image/*" onChange={handleFileChange} className="sr-only" />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">Puedes seleccionar varias fotos a la vez (PNG, JPG)</p>
                </div>
              </div>
              
              {/* Previsualización de las fotos subidas */}
              {previews.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">Fotos seleccionadas ({previews.length}):</p>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {previews.map((src, index) => (
                      <div key={index} className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        <img src={src} alt="Preview" className="w-full h-full object-cover" />
                        {index === 0 && <span className="absolute bottom-0 left-0 w-full bg-[#4da359] text-white text-[10px] text-center font-bold py-0.5">PORTADA</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SECCIÓN 2: DATOS DEL COCHE */}
            <div className="p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6"><i className="fas fa-list text-[#4da359] mr-2"></i> Detalles Técnicos</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Marca</label>
                  <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} required placeholder="Ej. Audi" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-[#4da359]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Modelo</label>
                  <input type="text" name="model" value={formData.model} onChange={handleInputChange} required placeholder="Ej. Q2 Advanced" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-[#4da359]" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Precio (€)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} required placeholder="23990" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-[#4da359]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Año</label>
                  <input type="number" name="year" value={formData.year} onChange={handleInputChange} required placeholder="2022" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-[#4da359]" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Kilómetros</label>
                  <input type="text" name="km" value={formData.km} onChange={handleInputChange} required placeholder="Ej. 104302 (sin puntos)" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-[#4da359]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Etiqueta (Opcional)</label>
                  <input type="text" name="tag" value={formData.tag} onChange={handleInputChange} placeholder="Ej. RECIÉN LLEGADO o VENDIDO" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-[#4da359]" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Combustible</label>
                  <select name="fuel" value={formData.fuel} onChange={handleInputChange} required className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-[#4da359]">
                    <option value="">Seleccionar...</option>
                    <option value="Diésel">Diésel</option>
                    <option value="Gasolina">Gasolina</option>
                    <option value="Híbrido">Híbrido</option>
                    <option value="Eléctrico">Eléctrico</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Transmisión</label>
                  <select name="transmission" value={formData.transmission} onChange={handleInputChange} required className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-[#4da359]">
                    <option value="">Seleccionar...</option>
                    <option value="Manual">Manual</option>
                    <option value="Automático">Automático</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción y Equipamiento</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={5} placeholder="- Navegador integrado&#10;- Sensores de aparcamiento&#10;- Faros LED..." className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-[#4da359]"></textarea>
              </div>
            </div>

            {/* SECCIÓN 3: BOTÓN DE SUBIDA */}
            <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button type="submit" disabled={loading} className={`px-8 py-4 rounded-xl font-bold text-white transition-all shadow-md ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#111] hover:bg-[#4da359]'}`}>
                {loading ? <><i className="fas fa-spinner fa-spin mr-2"></i> Procesando Subida...</> : 'Publicar Vehículo en Catálogo'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}