"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link"; // Importante para hacer los coches clicables
import { Car } from "../page";

export default function CatalogoInteractivo({ initialCars }: { initialCars: Car[] | null }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hasError = initialCars === null;
  const cars = initialCars || [];

  // Calcular el número de coches por marca para el desplegable
  const brandCounts = cars.reduce((acc, car) => {
    acc[car.brand] = (acc[car.brand] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const uniqueBrands = Object.keys(brandCounts).sort();

  // Cerrar el desplegable al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCars = cars.filter(car => {
    const matchSearch = car.model.toLowerCase().includes(search.toLowerCase()) || car.brand.toLowerCase().includes(search.toLowerCase());
    const matchBrand = brandFilter ? car.brand === brandFilter : true;
    return matchSearch && matchBrand;
  });

  const formatKm = (km: string) => Number(km.replace(/\./g, '')).toLocaleString('es-ES') + " km";

  const handleSelectBrand = (brand: string) => {
    setBrandFilter(brand);
    setSearch(brand);
    setIsDropdownOpen(false);
    // Hacer scroll suave hacia el catálogo
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      
      {/* TOP BAR (Como en la referencia) */}
      <div className="hidden md:flex bg-white text-xs py-2 px-8 justify-between items-center text-gray-900 border-b border-gray-100 font-medium tracking-wide">
        <div className="flex gap-6">
          <span><i className="fas fa-map-marker-alt text-gray-400 mr-1"></i> Avda. Principal, 12 - Marchena (Sevilla)</span>
          <span><i className="fas fa-phone-alt text-gray-400 mr-1"></i> 600 000 000</span>
        </div>
        <div>
          <span><i className="far fa-clock text-gray-400 mr-1"></i> LUNES - VIERNES 9:00 - 14:00 / 17:00 - 20:30</span>
        </div>
      </div>

      {/* NAVEGACIÓN */}
      <nav className="bg-[#111] text-white sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-20 items-center">
          
          {/* 1. Hemos envuelto el logo en un Link para que al pinchar vuelva al inicio */}
          <Link href="/" className="flex-shrink-0 flex items-center cursor-pointer">
            <Image src="/logo.png" alt="Logo Automóviles Rogelio" width={200} height={55} className="h-10 md:h-12 w-auto object-contain brightness-0 invert" priority />
          </Link>
          
          {/* 2. Enlaces de ordenador actualizados */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold tracking-wide uppercase">
            <Link href="/#inicio" className="hover:text-[#4da359] transition-colors">Inicio</Link>
            <Link href="/quienes-somos" className="hover:text-[#4da359] transition-colors">Quiénes somos</Link>
            <Link href="/#catalogo" className="text-[#4da359] transition-colors">Vehículos de ocasión</Link>
            <Link href="/contacto" className="hover:text-[#4da359] transition-colors">Contacto</Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Abrir menú" className="text-white hover:text-[#4da359] focus:outline-none">
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
            </button>
          </div>
        </div>

        {/* 3. Menú Móvil actualizado y añadiendo "Contacto" */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#1a1a1a] px-4 pt-2 pb-4 space-y-1 shadow-lg border-t border-gray-800">
            <Link href="/#inicio" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 text-sm font-semibold uppercase text-white hover:bg-gray-800">Inicio</Link>
            <Link href="/#catalogo" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 text-sm font-semibold uppercase text-[#4da359] hover:bg-gray-800">Vehículos de ocasión</Link>
            <Link href="/quienes-somos" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 text-sm font-semibold uppercase text-white hover:bg-gray-800">Quiénes somos</Link>
            <Link href="/contacto" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 text-sm font-semibold uppercase text-white hover:bg-gray-800">Contacto</Link>
          </div>
        )}
      </nav>

      {/* HERO SECTION CON BUSCADOR FLOTANTE */}
      <section id="inicio" className="pt-24 pb-32 md:pt-32 md:pb-48 flex items-center justify-center text-center px-4 relative bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), url('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="max-w-4xl relative z-10 w-full">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-10 tracking-tight">
            Encuentra tu <span className="text-[#4da359]">coche</span> perfecto
          </h1>
          
          {/* BUSCADOR CLONADO DE LA REFERENCIA */}
          <div className="relative max-w-3xl mx-auto z-50" ref={dropdownRef}>
            <div className="flex bg-white rounded-xl shadow-2xl p-2 items-center relative">
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder="Buscar por marca..." 
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    if (!isDropdownOpen) setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  className="w-full p-3 md:p-4 outline-none text-gray-700 text-base md:text-lg rounded-l-xl bg-transparent" 
                />
              </div>
              <button className="bg-[#4da359] text-white p-3 md:p-4 rounded-lg w-14 md:w-16 flex justify-center items-center hover:bg-green-700 transition flex-shrink-0">
                <i className="fas fa-search text-lg"></i>
              </button>

              {/* DESPLEGABLE DE MARCAS CON CONTADOR */}
              {isDropdownOpen && (
                <ul className="absolute top-full left-0 right-0 mt-2 bg-white shadow-2xl max-h-72 overflow-y-auto rounded-xl border border-gray-100 text-left z-50">
                  <li 
                    className="p-4 hover:bg-gray-50 cursor-pointer flex justify-between items-center text-gray-800 border-b border-gray-50"
                    onClick={() => handleSelectBrand("")}
                  >
                    <span className="font-medium">Todas las marcas</span>
                    <span className="text-gray-400 text-sm">({cars.length})</span>
                  </li>
                  {uniqueBrands.filter(b => b.toLowerCase().includes(search.toLowerCase())).map(brand => (
                    <li 
                      key={brand} 
                      className="p-4 hover:bg-gray-50 cursor-pointer flex justify-between items-center text-gray-800 border-b border-gray-50" 
                      onClick={() => handleSelectBrand(brand)}
                    >
                      <span className="font-medium">{brand}</span>
                      <span className="text-gray-400 text-sm">({brandCounts[brand]})</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CATÁLOGO ESTILO PREMIUM */}
      <section id="catalogo" className="py-20 bg-[#F4F6F9]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {hasError ? (
            <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-100">
              <p className="text-xl font-bold text-red-800">Error cargando el catálogo.</p>
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="text-center py-20">
              <i className="fas fa-search text-5xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 font-medium text-lg">No hay vehículos que coincidan con esta búsqueda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCars.map((car) => (
                /* ENVOLVEMOS TODA LA TARJETA EN UN LINK HACIA LA PÁGINA DEL COCHE */
                <Link href={`/vehiculo/${car.id}`} key={car.id} className="group block h-full">
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#4da359] transition-all duration-300 flex flex-col h-full relative">
                    
                    {/* Imagen del coche */}
                    <div className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden">
                      <Image 
                        src={car.image || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80"} 
                        alt={`${car.brand} ${car.model}`} 
                        fill 
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" 
                        className="object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      {/* Marca de agua simulada inferior */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/80 py-1 px-3 flex justify-between items-center text-[10px] text-white uppercase font-bold tracking-widest">
                        <span>Automóviles Rogelio</span>
                        <i className="fas fa-camera text-gray-400"></i>
                      </div>
                    </div>

                    {/* Contenido de la tarjeta */}
                    <div className="p-5 flex flex-col flex-grow">
                      {/* Título y Modelo truncado para mantener altura uniforme */}
                      <h3 className="text-gray-700 font-semibold text-sm uppercase truncate tracking-wide">
                        {car.brand} {car.model}
                      </h3>
                      
                      {/* Precio Gigante */}
                      <p className="text-3xl font-extrabold text-[#111] mt-2 mb-4">
                        {Number(car.price).toLocaleString('es-ES')}€
                      </p>
                      
                      {/* Detalles inferiores en línea */}
                      <div className="mt-auto flex items-center gap-2 text-[11px] md:text-xs text-gray-500 flex-wrap font-medium">
                        <span className="bg-[#4da359] text-white px-2 py-0.5 rounded shadow-sm">{car.year}</span>
                        <span>{formatKm(car.km)}</span>
                        <span>{car.transmission}</span>
                        <span>{car.fuel}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BOTÓN FLOTANTE WHATSAPP */}
      <a href="https://wa.me/34600000000" target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp" className="fixed bottom-6 right-6 bg-[#25D366] text-white w-14 h-14 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center animate-bounce-slow">
        <i className="fab fa-whatsapp text-3xl" aria-hidden="true"></i>
      </a>
    </main>
  )
}