import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1a1f24] text-gray-300 pt-16 pb-8 border-t-4 border-[#4da359] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-gray-800 pb-12">
          
          {/* Columna 1: Logo y descripción */}
          <div className="flex flex-col items-start">
            <Link href="/">
              <Image 
                src="/logo.png" 
                alt="Logo Automóviles Rogelio" 
                width={180} 
                height={50} 
                className="brightness-0 invert mb-6" 
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Tu concesionario de confianza. Llevamos años ofreciendo vehículos de ocasión revisados y garantizados con el mejor trato humano.
            </p>
          </div>

          {/* Columna 2: Enlaces Principales */}
          <div>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link href="/quienes-somos" className="hover:text-white transition flex items-center">
                  <span className="text-[#4da359] mr-3 text-lg leading-none">•</span> Quiénes somos
                </Link>
              </li>
              <li>
                <Link href="/#catalogo" className="hover:text-white transition flex items-center">
                  <span className="text-[#4da359] mr-3 text-lg leading-none">•</span> Vehículos de ocasión
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-white transition flex items-center">
                  <span className="text-[#4da359] mr-3 text-lg leading-none">•</span> Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Enlaces Legales y Newsletter */}
          <div>
            <ul className="space-y-4 text-sm font-medium mb-8">
              <li>
                <Link href="#" className="hover:text-white transition flex items-center">
                  <span className="text-[#4da359] mr-3 text-lg leading-none">•</span> Política de cookies
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition flex items-center">
                  <span className="text-[#4da359] mr-3 text-lg leading-none">•</span> Protección de datos
                </Link>
              </li>
            </ul>
            
            <h4 className="text-white font-bold mb-3 text-sm tracking-wide">Únete al Club</h4>
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); alert("¡Gracias por suscribirte!"); }}>
              <input 
                type="email" 
                placeholder="Tu email" 
                required
                className="w-full bg-[#111] text-white rounded-md py-2 px-3 text-sm border border-gray-700 focus:outline-none focus:border-[#4da359]" 
              />
              <button className="bg-[#4da359] hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-bold transition">
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>

          {/* Columna 4: Contacto */}
          <div className="md:text-right">
            <p className="text-3xl font-extrabold text-[#4da359] mb-2 tracking-tight">600 000 000</p>
            <p className="text-sm mb-6 hover:text-white cursor-pointer transition">info@automovilesrogelio.com</p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Avda. Principal, 12<br/>
              41620 – MARCHENA (SEVILLA)
            </p>
          </div>
        </div>

        {/* Barra Inferior */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>Copyright © {new Date().getFullYear()}. Automóviles Rogelio.</p>
          <div className="flex space-x-3 mt-6 md:mt-0">
            <a href="#" aria-label="Facebook" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#4da359] hover:text-white transition">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" aria-label="Instagram" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#4da359] hover:text-white transition">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" aria-label="YouTube" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#4da359] hover:text-white transition">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="#" aria-label="TikTok" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#4da359] hover:text-white transition">
              <i className="fab fa-tiktok"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}