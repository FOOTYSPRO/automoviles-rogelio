import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Quiénes Somos | Automóviles Rogelio",
  description: "Conoce nuestro concesionario en Marchena. Transparencia, garantía y trato humano.",
};

export default function QuienesSomos() {
  return (
    <main className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Más de una década sobre ruedas
          </h1>
          <p className="text-lg text-gray-600">
            En Automóviles Rogelio no solo vendemos coches, entregamos confianza. Nuestro objetivo es que encuentres el vehículo perfecto sin sorpresas ni letra pequeña.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
            <Image 
              src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Instalaciones Automóviles Rogelio" 
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Filosofía</h2>
            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-[#4da359]">
                    <i className="fas fa-check"></i>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-900">100% Revisados</h3>
                  <p className="mt-2 text-gray-600">Todos nuestros vehículos pasan por un exhaustivo control mecánico antes de pisar la exposición.</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-[#4da359]">
                    <i className="fas fa-handshake"></i>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-900">Trato Cercano</h3>
                  <p className="mt-2 text-gray-600">Somos de Marchena y trabajamos para nuestros vecinos. Si tienes una duda, estamos a una llamada de distancia.</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-[#4da359]">
                    <i className="fas fa-file-contract"></i>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-900">Garantía Real</h3>
                  <p className="mt-2 text-gray-600">Ofrecemos 12 meses de garantía porque confiamos plenamente en el producto que te llevas a casa.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#111] rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#4da359] rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">¿Listo para encontrar tu coche?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto relative z-10">Visita nuestro catálogo online o pásate por nuestras instalaciones. Estaremos encantados de asesorarte sin ningún compromiso.</p>
          <Link href="/#catalogo" className="inline-block bg-[#4da359] hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl transition shadow-lg relative z-10">
            Ver Vehículos de Ocasión
          </Link>
        </div>

      </div>
    </main>
  );
}