"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Car } from "../page";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function CatalogoInteractivo({ initialCars }: { initialCars: Car[] | null }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [sortBy, setSortBy] = useState("novedades");

  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const hasError = initialCars === null;
  const cars = initialCars || [];

  const brandCounts = cars.reduce((acc, car) => {
    acc[car.brand] = (acc[car.brand] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const uniqueBrands = Object.keys(brandCounts).sort();

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const docSnap = await getDoc(doc(db, "web_config", "portada"));
        if (docSnap.exists() && docSnap.data().images && docSnap.data().images.length > 0) {
          setHeroImages(docSnap.data().images);
        } else {
          setHeroImages(["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"]);
        }
      } catch (error) {
        setHeroImages(["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"]);
      }
    };
    fetchHeroImages();
  }, []);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  let filteredCars = cars.filter(car => {
    const matchSearch = car.model.toLowerCase().includes(search.toLowerCase()) || car.brand.toLowerCase().includes(search.toLowerCase());
    const matchBrand = brandFilter ? car.brand === brandFilter : true;
    return matchSearch && matchBrand;
  });

  if (sortBy === "precio-asc") {
    filteredCars.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortBy === "precio-desc") {
    filteredCars.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (sortBy === "km-asc") {
    filteredCars.sort((a, b) => Number(a.km.toString().replace(/\./g, '')) - Number(b.km.toString().replace(/\./g, '')));
  }

  const formatKm = (km: string) => Number(km.replace(/\./g, '')).toLocaleString('es-ES') + " km";

  const handleSelectBrand = (brand: string) => {
    setBrandFilter(brand);
    setSearch(brand);
    setIsDropdownOpen(false);
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      
      <div className="hidden md:flex bg-white text-xs py-2 px-8 justify-between items-center text-gray-900 border-b border-gray-100 font-medium tracking-wide">
        <div className="flex gap-6">
          <span><i className="fas fa-map-marker-alt text-gray-400 mr-1"></i> Avda. Principal, 12 - Marchena (Sevilla)</span>
          <span><i className="fas fa-phone-alt text-gray-400 mr-1"></i> 656 75 03 72</span>
        </div>
        <div>
          <span><i className="far fa-clock text-gray-400 mr-1"></i> LUNES - VIERNES 9:00 - 14:00 / 17:00 - 20:30</span>
        </div>
      </div>

      <nav className="bg-[#111] text-white sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-20 items-center">
          
          <Link href="/" className="flex-shrink-0 flex items-center cursor-pointer">
            <Image src="/logo.png" alt="Logo Automóviles Rogelio" width={200} height={55} className="h-10 md:h-12 w-auto object-contain brightness-0 invert" priority />
          </Link>
          
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

        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#1a1a1a] px-4 pt-2 pb-4 space-y-1 shadow-lg border-t border-gray-800">
            <Link href="/#inicio" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 text-sm font-semibold uppercase text-white hover:bg-gray-800">Inicio</Link>
            <Link href="/#catalogo" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 text-sm font-semibold uppercase text-[#4da359] hover:bg-gray-800">Vehículos de ocasión</Link>
            <Link href="/quienes-somos" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 text-sm font-semibold uppercase text-white hover:bg-gray-800">Quiénes somos</Link>
            <Link href="/contacto" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 text-sm font-semibold uppercase text-white hover:bg-gray-800">Contacto</Link>
          </div>
        )}
      </nav>

      <section id="inicio" className="pt-24 pb-32 md:pt-32 md:pb-48 flex items-center justify-center text-center px-4 relative overflow-hidden bg-gray-900">
        
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              index === currentHeroIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), url('${img}')` }}
          ></div>
        ))}

        <div className="max-w-5xl relative z-10 w-full">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-10 tracking-tight drop-shadow-lg">
            Encuentra tu <span className="text-[#4da359]">coche</span> perfecto
          </h1>
          
          <div className="relative max-w-4xl mx-auto z-50 flex flex-col md:flex-row gap-4 items-center justify-center" ref={dropdownRef}>
            <div className="flex bg-white rounded-xl shadow-2xl p-2 items-center relative w-full md:w-2/3">
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

            <div className="w-full md:w-1/3 flex-shrink-0">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-white shadow-2xl border-none p-4 text-gray-600 text-base md:text-lg font-medium rounded-xl outline-none cursor-pointer focus:ring-2 focus:ring-[#4da359] appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%234da359%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.85rem auto' }}
              >
                <option value="novedades">Novedades primero</option>
                <option value="precio-asc">Precio: Más barato</option>
                <option value="precio-desc">Precio: Más caro</option>
                <option value="km-asc">Menos kilómetros</option>
              </select>
            </div>
          </div>
        </div>
      </section>

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
                <Link href={`/vehiculo/${car.id}`} key={car.id} className="group block h-full">
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#4da359] transition-all duration-300 flex flex-col h-full relative">
                    
                    <div className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden">
                      
                      {car.tag && (
                        <div className={`absolute top-5 -left-10 w-40 text-center transform -rotate-45 text-white font-extrabold py-1 shadow-lg z-20 text-[11px] uppercase tracking-wider ${
                          car.tag.toLowerCase().includes('vendido') ? 'bg-red-600' : 
                          car.tag.toLowerCase().includes('reservado') ? 'bg-[#eab308]' : 
                          'bg-[#b18b2c]'
                        }`}>
                          {car.tag}
                        </div>
                      )}

                      <Image 
                        src={car.image || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80"} 
                        alt={`${car.brand} ${car.model}`} 
                        fill 
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" 
                        className="object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/80 py-1 px-3 flex justify-between items-center text-[10px] text-white uppercase font-bold tracking-widest z-10">
                        <span>Automóviles Rogelio</span>
                        <i className="fas fa-camera text-gray-400"></i>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      
                      {/* CAMBIO AQUÍ: title a dos líneas (line-clamp-2) y altura mínima para que quede alineado */}
                      <h3 className="text-gray-700 font-semibold text-sm uppercase line-clamp-2 tracking-wide min-h-[2.5rem] leading-snug">
                        {car.brand} {car.model}
                      </h3>
                      
                      <p className="text-3xl font-extrabold text-[#111] mt-2 mb-4">
                        {Number(car.price).toLocaleString('es-ES')}€
                      </p>
                      
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

      <a href="https://wa.me/34656750372" target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp" className="fixed bottom-6 right-6 bg-[#25D366] text-white w-14 h-14 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center animate-bounce-slow">
        <i className="fab fa-whatsapp text-3xl" aria-hidden="true"></i>
      </a>
    </main>
  )
}