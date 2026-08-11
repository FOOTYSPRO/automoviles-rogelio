import { db } from "../../firebase";
import { doc, getDoc, collection, query, where, getDocs, limit } from "firebase/firestore";
import Link from "next/link";
import GaleriaVehiculo from "../../components/GaleriaVehiculo";
import SimuladorFinanciacion from "../../components/SimuladorFinanciacion";

export const dynamic = 'force-dynamic';

// --- NUEVO: FUNCIÓN PARA EL SEO DINÁMICO DE WHATSAPP ---
export async function generateMetadata({ params }: any) {
  try {
    const resolvedParams = await params;
    const docRef = doc(db, "vehiculos", resolvedParams?.id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return { title: 'Vehículo no encontrado | Automóviles Rogelio' };
    }

    const car = docSnap.data();
    const precio = car.price ? Number(car.price).toLocaleString('es-ES') : "Consultar";
    const titulo = `${car.brand} ${car.model} por ${precio}€`;
    const descripcion = `Vehículo de ocasión ${car.year} con ${Number(String(car.km).replace(/\./g, '')).toLocaleString('es-ES')} km. Totalmente revisado y garantizado.`;
    const imagen = car.image || car.images?.[0] || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&q=80";

    return {
      title: `${titulo} | Automóviles Rogelio`,
      description: descripcion,
      openGraph: {
        title: titulo,
        description: descripcion,
        images: [{ url: imagen, width: 1200, height: 630 }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: titulo,
        description: descripcion,
        images: [imagen],
      }
    };
  } catch (error) {
    return { title: 'Vehículo | Automóviles Rogelio' };
  }
}

export default async function VehiculoPage({ params }: any) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id) {
      throw new Error("No se ha recibido el ID del coche en la URL.");
    }

    const docRef = doc(db, "vehiculos", id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="p-20 text-center text-2xl font-bold text-gray-400">Coche no encontrado (Error 404)</div>
        </div>
      );
    }

    const car = { id: docSnap.id, ...docSnap.data() } as any;

    let relatedCars: any[] = [];
    if (car.brand) {
      const q = query(collection(db, "vehiculos"), where("brand", "==", car.brand), limit(4));
      const snapshot = await getDocs(q);
      relatedCars = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(c => c.id !== car.id)
        .slice(0, 3);
    }

    const precio = car.price ? Number(car.price).toLocaleString('es-ES') : "Consultar";
    const kilometros = car.km ? String(car.km).replace(/\./g, '') : "0";
    const kmFormat = Number(kilometros).toLocaleString('es-ES');
    const foto = car.image || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&q=80";
    
    // MENSAJE DE WHATSAPP ACTUALIZADO
    const whatsappMsg = encodeURIComponent(`Hola, me interesa el ${car.brand} ${car.model} por ${precio}€ que he visto en la web.`);

    return (
      <main className="min-h-screen bg-white text-gray-800 font-sans pb-20">
        
        <nav className="bg-[#111] text-white sticky top-0 z-40 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-20 items-center">
            <Link href="/">
              <img src="/logo.png" alt="Logo Automóviles Rogelio" className="h-10 md:h-12 w-auto object-contain brightness-0 invert" />
            </Link>
            <div className="hidden md:flex items-center space-x-8 text-sm font-semibold tracking-wide uppercase">
              <Link href="/#inicio" className="hover:text-[#4da359] transition-colors">Inicio</Link>
              <Link href="/#catalogo" className="text-[#4da359] transition-colors">Vehículos de ocasión</Link>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="text-sm text-gray-400 mb-8 font-medium">
            <Link href="/" className="hover:text-gray-700 transition">Inicio</Link> 
            <span className="mx-2">-</span> 
            <Link href="/#catalogo" className="hover:text-gray-700 transition">Vehículos de ocasión</Link>
            <span className="mx-2">-</span> 
            <span className="hover:text-gray-700 transition">{car.brand}</span>
            <span className="mx-2">-</span> 
            <span className="text-[#b18b2c] font-semibold uppercase">{car.brand} {car.model}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-7">
              <GaleriaVehiculo 
                images={car.images && car.images.length > 0 ? car.images : [foto]} 
                altText={`${car.brand} ${car.model}`} 
              />

              <h2 className="text-2xl font-bold text-[#111] mb-6 mt-12">Descripción</h2>
              <div className="prose max-w-none text-gray-600">
                <p className="font-bold text-gray-800 uppercase mb-4">{car.brand} {car.model} DE {car.year || "Ocasión"}</p>
                <p className="mb-4">CON LAS SIGUIENTES PRESTACIONES A DESTACAR:</p>
                {car.description ? (
                  <div className="whitespace-pre-line bg-gray-50 p-6 rounded-xl border border-gray-100 leading-relaxed">
                    {car.description}
                  </div>
                ) : (
                  <ul className="list-disc pl-5 space-y-2 font-medium">
                    <li>Vehículo totalmente revisado</li>
                    <li>Garantía de 12 meses incluida</li>
                    <li>Mantenimientos al día</li>
                    <li>Posibilidad de financiación a medida</li>
                  </ul>
                )}
              </div>
            </div>

            <div className="lg:col-span-5">
              <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-6 uppercase tracking-wide leading-tight">
                {car.brand} {car.model} <br/>
                <span className="font-bold text-[#b18b2c] mt-4 block">{precio}€</span>
              </h1>

              <div className="bg-[#f5f8fc] rounded-2xl p-8 mb-8">
                <div className="grid grid-cols-2 gap-y-6 text-sm">
                  <div className="text-gray-500 font-bold">Combustible:</div>
                  <div className="text-gray-900 font-medium text-right">{car.fuel || "-"}</div>
                  
                  <div className="text-gray-500 font-bold">Cambio:</div>
                  <div className="text-gray-900 font-medium text-right">{car.transmission || "-"}</div>
                  
                  <div className="text-gray-500 font-bold">Año:</div>
                  <div className="text-gray-900 font-medium text-right">{car.year || "-"}</div>
                  
                  <div className="text-gray-500 font-bold">Kilometraje:</div>
                  <div className="text-gray-900 font-medium text-right">{kmFormat} km</div>
                </div>
              </div>

              {car.price && (
                <SimuladorFinanciacion precioTotal={Number(car.price)} />
              )}
              
              <div className="mb-8 mt-8">
                <div className="bg-white border border-gray-100 shadow-xl rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#4da359]"></div>
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">Solicitar Información</h3>
                  
                  {/* ENLACE DE WHATSAPP ACTUALIZADO A TU NÚMERO */}
                  <a href={`https://wa.me/34656750372?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer" className="w-full bg-[#111] hover:bg-[#222] text-white font-bold py-4 rounded-lg transition-colors flex justify-center items-center gap-2">
                    <i className="fab fa-whatsapp text-xl"></i> Contactar por WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div> 

          {relatedCars.length > 0 && (
            <div className="mt-24 border-t border-gray-100 pt-16">
              <h2 className="text-2xl font-extrabold text-[#111] mb-8">Relacionados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {relatedCars.map(related => (
                  <Link href={`/vehiculo/${related.id}`} key={related.id} className="group block">
                    <div className="bg-[#1e232e] rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-transform relative text-white h-full flex flex-col">
                      <div className="relative aspect-[4/3] w-full bg-gray-800">
                        <img src={related.image || foto} alt={related.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-xs"><i className="far fa-images"></i> 1</div>
                      </div>
                      <div className="p-5 flex-grow flex flex-col">
                        <h3 className="text-sm font-semibold uppercase truncate mb-2">{related.brand} {related.model}</h3>
                        <p className="text-xl font-bold mb-4">{Number(related.price || 0).toLocaleString('es-ES')}€</p>
                        <div className="mt-auto flex gap-2 text-[11px] text-gray-300">
                          <span className="bg-[#b18b2c] text-white px-2 py-0.5 rounded font-bold">{related.year}</span>
                          <span>{Number(String(related.km || "0").replace(/\./g, '')).toLocaleString('es-ES')} km</span>
                          <span>{related.fuel}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    );

  } catch (error: any) {
    return (
      <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-red-200 max-w-2xl w-full">
          <h1 className="text-3xl font-extrabold text-red-600 mb-4">🚨 Error detectado</h1>
          <p className="text-gray-700 mb-6">Next.js ha bloqueado la página por este error exacto:</p>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-left overflow-auto">
            {error.message || "Error desconocido. Revisa la terminal local."}
          </div>
        </div>
      </div>
    );
  }
}