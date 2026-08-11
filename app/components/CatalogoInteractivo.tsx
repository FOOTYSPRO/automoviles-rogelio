// app/components/CatalogoInteractivo.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Car } from "../page";

export default function CatalogoInteractivo({ initialCars }: { initialCars: Car[] | null }) {
  // Punto 3: Estado para el menú móvil
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Estados para los filtros
  const [search, setSearch] = useState("");
  const [fuelFilter, setFuelFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState(""); // Punto 5: Filtro real de marcas

  const hasError = initialCars === null;
  const cars = initialCars || [];

  // Punto 5: Lógica de filtros combinados
  const filteredCars = cars.filter(car => {
    const matchSearch = car.model.toLowerCase().includes(search.toLowerCase()) || car.brand.toLowerCase().includes(search.toLowerCase());
    const matchFuel = fuelFilter ? car.fuel === fuelFilter : true;
    const matchBrand = brandFilter ? car.brand === brandFilter : true;
    return matchSearch && matchFuel && matchBrand;
  });

  const uniqueBrands = Array.from(new Set(cars.map(c => c.brand)));
  
  // Punto 10: Formatear kilómetros correctamente
  const formatKm = (km: string) => Number(km.replace(/\./g, '')).toLocaleString('es-ES') + " km";

  return (
    <main className="min-h-screen bg-[#F3F4F6] text-gray-800 font-sans">
      
      {/* NAVEGACIÓN Y MENÚ MÓVIL */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-24 items-center">
          <div className="flex-shrink-0 flex items-center cursor-pointer">
            <Image src="/logo.png" alt="Logo Automóviles Rogelio" width={220} height={65} className="h-12 md:h-16 w-auto object-contain" priority />
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#inicio" className="text-gray-800 hover:text-[#4da359] font-medium transition-colors">Inicio</a>
            <a href="#catalogo" className="text-gray-800 hover:text-[#4da359] font-medium transition-colors">Catálogo</a>
            <a href="#nosotros" className="text-gray-800 hover:text-[#4da359] font-medium transition-colors">Sobre Nosotros</a>
            <a href="tel:+34600000000" className="bg-[#4da359] hover:bg-green-700 text-white px-6 py-2 rounded-full font-bold transition-all shadow-md">
              <i className="fas fa-phone-alt mr-2" aria-hidden="true"></i>Llámanos
            </a>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Abrir menú" className="text-gray-800 hover:text-[#4da359] focus:outline-none">
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-3xl`}></i>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-1 shadow-lg">
            <a href="#inicio" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-50">Inicio</a>
            <a href="#catalogo" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-50">Catálogo</a>
            <a href="#nosotros" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-50">Sobre Nosotros</a>
          </div>
        )}
      </nav>

      {/* HERO SECTION (Punto 9: Contador como gancho) */}
      <section id="inicio" className="py-24 md:py-32 flex items-center justify-center text-center px-4 relative bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(36, 24, 101, 0.85), rgba(36, 24, 101, 0.7)), url('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="max-w-4xl relative z-10 w-full">
          <span className="text-[#4da359] font-bold tracking-wider uppercase text-sm mb-4 block">Tu concesionario en Marchena</span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">Confianza y Experiencia <br/>en cada Kilómetro</h1>
          {!hasError && cars.length > 0 && (
            <p className="text-white font-bold mb-8 bg-[#4da359]/20 inline-block px-4 py-2 rounded-full border border-[#4da359]/50 shadow-sm backdrop-blur-sm">
              <i className="fas fa-car-side mr-2"></i> {cars.length} vehículos revisados y listos para ti
            </p>
          )}
          <br/>
          <a href="#catalogo" className="inline-block bg-[#4da359] hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl transition-transform hover:-translate-y-1">
            Ver Catálogo Actual
          </a>
        </div>
      </section>

      {/* CATÁLOGO Y FILTROS */}
      <section id="catalogo" className="py-20 bg-[#F3F4F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Vehículos Disponibles</h2>
            <div className="w-20 h-1 bg-[#4da359] mx-auto rounded mb-8"></div>
            
            {/* Punto 7: Etiquetas ocultas (sr-only) para accesibilidad */}
            <div className="flex flex-col md:flex-row gap-4 justify-center max-w-4xl mx-auto bg-white p-4 rounded-xl shadow-sm">
              <label htmlFor="search" className="sr-only">Buscar modelo</label>
              <input id="search" type="text" placeholder="Buscar modelo (ej. A3, Golf)..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-[#4da359]" />
              
              <label htmlFor="brand" className="sr-only">Filtrar por marca</label>
              <select id="brand" value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="w-full md:w-48 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-[#4da359] bg-white">
                <option value="">Todas las marcas</option>
                {uniqueBrands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
              </select>

              <label htmlFor="fuel" className="sr-only">Filtrar por combustible</label>
              <select id="fuel" value={fuelFilter} onChange={(e) => setFuelFilter(e.target.value)} className="w-full md:w-48 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-[#4da359] bg-white">
                <option value="">Tipo de motor</option>
                <option value="Diésel">Diésel</option>
                <option value="Gasolina">Gasolina</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Eléctrico">Eléctrico</option>
              </select>
            </div>
          </div>

          {/* Punto 2: Gestión Real de Errores de Conexión */}
          {hasError ? (
            <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-100">
              <i className="fas fa-exclamation-triangle text-5xl text-red-400 mb-4"></i>
              <p className="text-xl font-bold text-red-800">Estamos actualizando el inventario de la base de datos.</p>
              <p className="text-red-600 mt-2">Por favor, vuelve a recargar la página en unos minutos.</p>
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="text-center py-20">
              <i className="fas fa-search text-5xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 font-medium text-lg">No hay vehículos que coincidan con esta búsqueda exacta.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCars.map((car) => {
                // Punto 9: Mensaje de WhatsApp precargado por coche
                const whatsappMsg = encodeURIComponent(`Hola Rogelio, me interesa el ${car.brand} ${car.model} que he visto en la web por ${Number(car.price).toLocaleString('es-ES')}€.`);
                
                return (
                  <div key={car.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:-translate-y-2 transition-transform duration-300 relative group flex flex-col">
                    <div className="relative h-60 w-full overflow-hidden bg-gray-200">
                      {/* Punto 4 y 7: next/image optimizado con Lazy Loading automático */}
                      <Image 
                        src={car.image || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80"} 
                        alt={`${car.brand} ${car.model} ocasión`} 
                        fill 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      {car.tag && <div className="absolute top-4 right-4 bg-[#4da359] text-white px-3 py-1 rounded-full text-xs font-bold shadow-md z-10">{car.tag}</div>}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 leading-tight">{car.brand}</h3>
                          <p className="text-gray-500 text-sm mt-1">{car.model}</p>
                        </div>
                        <span className="text-2xl font-extrabold text-[#241865]">{Number(car.price).toLocaleString('es-ES')}€</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 border-t border-gray-100 pt-4 mt-4 mb-6">
                        <div className="flex items-center gap-2"><i className="far fa-calendar-alt text-[#4da359]"></i> {car.year}</div>
                        <div className="flex items-center gap-2"><i className="fas fa-tachometer-alt text-[#4da359]"></i> {formatKm(car.km)}</div>
                        <div className="flex items-center gap-2"><i className="fas fa-gas-pump text-[#4da359]"></i> {car.fuel}</div>
                        <div className="flex items-center gap-2"><i className="fas fa-cogs text-[#4da359]"></i> {car.transmission}</div>
                      </div>
                      
                      <div className="mt-auto">
                        {/* Punto 9: Simulación de financiación psicológica */}
                        <p className="text-center text-xs text-gray-400 mb-2 font-medium">Financiación disponible desde {(car.price / 60).toFixed(0)}€/mes</p>
                        
                        <a href={`https://wa.me/34600000000?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer" className="w-full text-center bg-[#25D366] hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm">
                          <i className="fab fa-whatsapp text-xl"></i> Consultar Disponibilidad
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <footer className="bg-[#1F2937] text-white pt-16 pb-8 border-t-4 border-[#4da359]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <Image src="/logo.png" alt="Logo Automóviles Rogelio" width={180} height={50} className="mb-4 brightness-0 invert" />
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
              <label htmlFor="newsletter" className="sr-only">Tu email</label>
              <input id="newsletter" type="email" placeholder="Tu email" className="w-full bg-gray-800 text-white rounded-lg py-2.5 px-4 border border-gray-700 focus:outline-none focus:border-[#4da359]" />
              <button className="w-full bg-[#4da359] hover:bg-green-700 text-white font-bold py-2.5 rounded-lg transition-colors">Suscribirme</button>
            </form>
          </div>
        </div>
      </footer>

      {/* Punto 7: aria-label en botones sueltos */}
      <a href="https://wa.me/34600000000" target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp" className="fixed bottom-6 right-6 bg-[#25D366] text-white w-14 h-14 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center animate-bounce-slow">
        <i className="fab fa-whatsapp text-3xl" aria-hidden="true"></i>
      </a>
    </main>
  )
}