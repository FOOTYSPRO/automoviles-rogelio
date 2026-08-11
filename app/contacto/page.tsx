"use client";

import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function Contacto() {
  const [formData, setFormData] = useState({ nombre: "", email: "", telefono: "", mensaje: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await addDoc(collection(db, "mensajes_contacto"), {
        ...formData,
        fecha: new Date(),
        leido: false
      });
      setStatus("success");
      setFormData({ nombre: "", email: "", telefono: "", mensaje: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-16 pb-20 font-sans">
      <div className="bg-[#111] py-20 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Contacta con Nosotros</h1>
        <p className="text-gray-400 max-w-2xl mx-auto px-4">¿Tienes alguna duda sobre un vehículo o financiación? Escríbenos o ven a visitarnos a Marchena.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          
          {/* Información de Contacto */}
          <div className="bg-[#1a1f24] text-white p-10 md:p-16 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#4da359] rounded-full blur-[100px] opacity-10"></div>
            
            <div>
              <h2 className="text-2xl font-bold mb-8">Información de Contacto</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <i className="fas fa-map-marker-alt mt-1 text-[#4da359] text-xl w-8"></i>
                  <div>
                    <h3 className="font-bold">Dirección</h3>
                    <p className="text-gray-400 mt-1">Avda. Principal, 12<br/>41620 - Marchena (Sevilla)</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-phone-alt mt-1 text-[#4da359] text-xl w-8"></i>
                  <div>
                    <h3 className="font-bold">Teléfono</h3>
                    <p className="text-gray-400 mt-1">600 000 000</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="far fa-envelope mt-1 text-[#4da359] text-xl w-8"></i>
                  <div>
                    <h3 className="font-bold">Email</h3>
                    <p className="text-gray-400 mt-1">info@automovilesrogelio.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h3 className="font-bold mb-4">Horario de Apertura</h3>
              <p className="text-gray-400 text-sm">Lunes - Viernes: 9:00 - 14:00 / 17:00 - 20:30</p>
              <p className="text-gray-400 text-sm mt-1">Sábados: Con cita previa</p>
            </div>
          </div>

          {/* Formulario de Contacto */}
          <div className="p-10 md:p-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Envíanos un mensaje</h2>
            
            {status === "success" && (
              <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl mb-6 font-medium">
                ¡Mensaje enviado con éxito! Te contactaremos lo antes posible.
              </div>
            )}
            
            {status === "error" && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl mb-6 font-medium">
                Hubo un error al enviar el mensaje. Por favor, intenta llamarnos.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre completo *</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-[#4da359] focus:ring-1 focus:ring-[#4da359]" placeholder="Tu nombre" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-[#4da359] focus:ring-1 focus:ring-[#4da359]" placeholder="tu@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
                  <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-[#4da359] focus:ring-1 focus:ring-[#4da359]" placeholder="600 000 000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mensaje *</label>
                <textarea name="mensaje" value={formData.mensaje} onChange={handleChange} required rows={4} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-[#4da359] focus:ring-1 focus:ring-[#4da359]" placeholder="¿En qué te podemos ayudar?"></textarea>
              </div>
              <button type="submit" disabled={status === "loading"} className="w-full bg-[#111] hover:bg-[#4da359] text-white font-bold py-4 rounded-xl transition shadow-md disabled:bg-gray-400">
                {status === "loading" ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
                {status === "loading" ? "Enviando..." : "Enviar Mensaje"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}