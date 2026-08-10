"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCars() {
      try {
        const querySnapshot = await getDocs(collection(db, "vehiculos"));
        const inventory = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCars(inventory);
      } catch (error) {
        console.error("Error cargando coches: ", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

  return (
    <main className="min-h-screen bg-[#F3F4F6] text-gray-800 font-sans">
      
      {/* NAVEGACIÓN */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-24 items-center">
          <div className="flex-shrink-0 flex items-center cursor-pointer">
            <div className="flex items-center text-2xl md:text-3xl font-bold">
              <span className="text-[#241865]">Automóviles</span>
              <span className="text-[#4da359] ml-2">Rogelio</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#inicio" className="text-gray-800 hover:text-[#4da359] font-medium transition-colors">Inicio</a>
            <a href="#catalogo" className="text-gray-800 hover:text-[#4da359] font-medium transition-colors">Catálogo</a>
            <a href="#nosotros" className="text-gray-800 hover:text-[#4da359] font-medium transition-colors">Sobre Nosotros</a>
            <a href="tel:+34600000000" className="bg-[#4da359] hover:bg-green-700 text-white px-6 py-2 rounded-full font-bold transition-all shadow-md">
              <i className="fas fa-phone-alt mr-2"></i>Llámanos
            </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="inicio" className="py-24 md:py-32 flex items-center justify-center text-center px-4 relative bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(36, 24, 101, 0.85), rgba(36, 24, 101, 0.7)), url('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="max-w-4xl relative z-10 w-full">
          <span className="text-[#4da359] font-bold tracking-wider uppercase text-sm mb-4 block">Tu concesionario en Marchena</span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">Confianza y Experiencia <br/>en cada Kilómetro</h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light">Vehículos revisados, garantizados y listos para disfrutar.</p>
          <a href="#catalogo" className="inline-block bg-[#4da359] hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl transition-transform hover:-translate-y-1">
            Ver Catálogo Actual
          </a>
        </div>
      </section>

      {/* POR QUÉ ELEGIRNOS */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 border rounded-2xl shadow-sm border-gray-100 hover:border-[#241865] transition-colors">
            <i className="fas fa-medal text-4xl text-[#241865] mb-4"></i>
            <h3 className="text-xl font-bold mb-2">Años de Experiencia</h3>
            <p className="text-gray-600 text-sm">Somos referentes en Marchena. Conocemos el mercado local a la perfección.</p>
          </div>
          <div className="text-center p-8 border rounded-2xl shadow-sm border-gray-100 hover:border-[#4da359] transition-colors">
            <i className="fas fa-tools text-4xl text-[#4da359] mb-4"></i>
            <h3 className="text-xl font-bold mb-2">Revisión Exhaustiva</h3>
            <p className="text-gray-600 text-sm">Cada coche es revisado en 100 puntos por nuestros mecánicos de confianza.</p>
          </div>
          <div className="text-center p-8 border rounded-2xl shadow-sm border-gray-100 hover:border-[#241865] transition-colors">
            <i className="fas fa-handshake text-4xl text-[#241865] mb-4"></i>
            <h3 className="text-xl font-bold mb-2">Trato Cercano</h3>
            <p className="text-gray-600 text-sm">Transparencia total, sin letra pequeña. Te asesoramos como a un amigo.</p>
          </div>
        </div>
      </section>

      {/* CATÁLOGO (CONECTADO A FIREBASE) */}
      <section id="catalogo" className="py-20 bg-[#F3F4F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Vehículos Disponibles</h2>
            <div className="w-20 h-1 bg-[#4da359] mx-auto rounded"></div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <i className="fas fa-circle-notch fa-spin text-5xl text-[#4da359] mb-4"></i>
              <p className="text-xl font-bold text-[#241865]">Aparcando los coches...</p>
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center py-20">
              <i className="fas fa-car-side text-5xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 font-medium text-lg">No hay vehículos en el catálogo en este momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cars.map((car) => (
                <div key={car.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:-translate-y-2 transition-transform duration-300 cursor-pointer relative group">
                  <div className="relative h-60 overflow-hidden bg-gray-200">
                    <img src={car.image || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80"} alt={car.model} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    {car.tag && <div className="absolute top-4 right-4 bg-[#4da359] text-white px-3 py-1 rounded-full text-xs font-bold shadow-md z-10">{car.tag}</div>}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 leading-tight">{car.brand}</h3>
                        <p className="text-gray-500 text-sm mt-1">{car.model}</p>
                      </div>
                      <span className="text-2xl font-extrabold text-[#241865]">{Number(car.price).toLocaleString('es-ES')}€</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 border-t border-gray-100 pt-4 mt-4">
                      <div className="flex items-center gap-2"><i className="far fa-calendar-alt text-[#4da359]"></i> {car.year}</div>
                      <div className="flex items-center gap-2"><i className="fas fa-tachometer-alt text-[#4da359]"></i> {car.km}</div>
                      <div className="flex items-center gap-2"><i className="fas fa-gas-pump text-[#4da359]"></i> {car.fuel}</div>
                      <div className="flex items-center gap-2"><i className="fas fa-cogs text-[#4da359]"></i> {car.transmission}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1F2937] text-white pt-16 pb-8 border-t-4 border-[#4da359]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center text-2xl font-bold mb-4">
              <span className="text-white">Automóviles</span><span className="text-[#4da359] ml-2">Rogelio</span>
            </div>
            <p className="text-gray-400 text-sm">Tu concesionario de confianza. Calidad, garantía y el mejor trato humano en Marchena.</p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2">Contacto</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3"><i className="fas fa-map-marker-alt mt-1 text-[#4da359]"></i><span>Marchena, Sevilla</span></li>
              <li className="flex items-center gap-3"><i className="fas fa-phone-alt text-[#4da359]"></i><span>600 000 000</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2">Únete al Club</h4>
            <p className="text-sm text-gray-400 mb-4">Entérate de los coches nuevos antes que nadie.</p>
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); alert("Suscrito!"); }}>
              <input type="email" placeholder="Tu email" className="w-full bg-gray-800 text-white rounded-lg py-2.5 px-4 border border-gray-700 focus:outline-none focus:border-[#4da359]" />
              <button className="w-full bg-[#4da359] hover:bg-green-700 text-white font-bold py-2.5 rounded-lg transition-colors">Suscribirme</button>
            </form>
          </div>
        </div>
      </footer>

    </main>
  );
}