import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Quiénes Somos | Automóviles Rogelio",
  description: "Conoce la historia de Automóviles Rogelio. Más de X años ofreciendo vehículos de ocasión revisados y garantizados en Marchena (Sevilla).",
};

export default function QuienesSomos() {
  return (
    <main className="min-h-screen bg-white">
      {/* HEADER SIMPLE */}
      <nav className="bg-[#111] text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-20 items-center">
          <Link href="/">
            <Image src="/logo.png" alt="Logo Automóviles Rogelio" width={200} height={55} className="h-10 md:h-12 w-auto object-contain brightness-0 invert" priority />
          </Link>
          <div className="hidden md:flex space-x-8 text-sm font-semibold tracking-wide uppercase">
            <Link href="/#inicio" className="hover:text-[#4da359] transition-colors">Inicio</Link>
            <Link href="/#catalogo" className="hover:text-[#4da359] transition-colors">Catálogo</Link>
          </div>
        </div>
      </nav>

      {/* CABECERA DE LA PÁGINA */}
      <section className="bg-[#F4F6F9] py-20 text-center border-b border-gray-200">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#111] uppercase tracking-tight mb-4">Quiénes Somos</h1>
        <div className="w-16 h-1 bg-[#4da359] mx-auto rounded"></div>
      </section>

      {/* CONTENIDO */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Experiencia y confianza en Marchena</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              En Automóviles Rogelio no solo vendemos coches, vendemos tranquilidad. Llevamos años trabajando en el sector de la automoción en Marchena, seleccionando personalmente cada vehículo que entra en nuestras instalaciones.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Nuestro compromiso es la transparencia. Todos nuestros vehículos de ocasión son sometidos a una rigurosa revisión mecánica antes de ser entregados, garantizando que tu próxima compra sea un éxito.
            </p>
            <Link href="/contacto" className="inline-block bg-[#4da359] hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
              Ven a conocernos
            </Link>
          </div>
          <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
            {/* Aquí luego puedes poner una foto real de Rogelio o de la fachada del concesionario */}
            <Image src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800" alt="Instalaciones Automóviles Rogelio" fill className="object-cover" />
          </div>
        </div>
      </section>
    </main>
  );
}