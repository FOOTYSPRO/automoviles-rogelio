import { db } from "../../firebase";
import { doc, getDoc, collection, query, where, getDocs, limit } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

async function getCar(id: string) {
  try {
    const docRef = doc(db, "vehiculos", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as any;
  } catch (error) {
    console.error("Error obteniendo coche:", error);
    return null;
  }
}

async function getRelatedCars(brand: string, currentId: string) {
  try {
    const q = query(collection(db, "vehiculos"), where("brand", "==", brand), limit(4));
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as any))
      .filter(car => car.id !== currentId)
      .slice(0, 3);
  } catch {
    return [];
  }
}

// ARREGLO 1: Compatible con el nuevo Next.js (params como Promise)
export default async function VehiculoPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  
  // Resolvemos los parámetros de forma segura
  const resolvedParams = await Promise.resolve(params);
  const car = await getCar(resolvedParams.id);
  
  if (!car) {
    notFound();
  }

  const relatedCars = await getRelatedCars(car.brand || "", car.id);
  
  // ARREGLO 2: Protección de datos (por si km es número o falta algún precio)
  const precioFormateado = car.price ? Number(car.price).toLocaleString('es-ES') : "0";
  const kilometros = car.km ? String(car.km).replace(/\./g, '') : "0";
  const kmFormateado = Number(kilometros).toLocaleString('es-ES');
  const imagenSegura = car.image || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&q=80";

  const whatsappMsg = encodeURIComponent(`Hola Rogelio, me interesa el ${car.brand} ${car.model} (${car.year}) que he visto en la web por ${precioFormateado}€.`);

  return (
    <main className="min-h-screen bg-white text-gray-800 font-sans pb-20">
      
      {/* HEADER SIMPLIFICADO */}
      <nav className="bg-[#111] text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-20 items-center">
          <Link href="/">
            <Image src="/logo.png" alt="Logo Automóviles Rogelio" width={200} height={55} className="h-10 md:h-12 w-auto object-contain brightness-0 invert" priority />
          </Link>
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold tracking-wide uppercase">
            <Link href="/#inicio" className="hover:text-[#4da359] transition-colors">Inicio</Link>
            <Link href="/#catalogo" className="text-[#4da359] transition-colors">Vehículos de ocasión</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* MIGAS DE PAN (Breadcrumbs) */}
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
          
          {/* COLUMNA IZQUIERDA: GALERÍA Y DESCRIPCIÓN */}
          <div className="lg:col-span-7">
            {/* Imagen Principal */}
            <div className="relative aspect-[4/3] w-full bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-4">
              <Image 
                src={imagenSegura} 
                alt={`${car.brand} ${car.model}`} 
                fill 
                sizes="(max-width: 1024px) 100vw, 60vw" 
                className="object-cover"
                priority
              />
            </div>
            
            {/* Miniaturas (Simuladas hasta que mejoremos el Admin) */}
            <div className="grid grid-cols-5 gap-2 md:gap-4 mb-12">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer border-2 ${i === 1 ? 'border-[#b18b2c]' : 'border-transparent hover:border-gray-300'}`}>
                   <Image src={imagenSegura} alt="Miniatura" fill className="object-cover" />
                </div>
              ))}
            </div>

            {/* Descripción */}
            <h2 className="text-2xl font-bold text-[#111] mb-6">Descripción</h2>
            <div className="prose max-w-none text-gray-600">
              <p className="font-bold text-gray-800 uppercase mb-4">{car.brand} {car.model} DE {car.year}</p>
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

          {/* COLUMNA DERECHA: INFO Y CONTACTO */}
          <div className="lg:col-span-5">
            <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-6 uppercase tracking-wide leading-tight">
              {car.brand} {car.model} <br/>
              <span className="font-bold text-[#b18b2c] mt-4 block">{precioFormateado}€</span>
            </h1>

            {/* Tarjeta Azulita de Especificaciones */}
            <div className="bg-[#f5f8fc] rounded-2xl p-8 mb-8">
              <div className="grid grid-cols-2 gap-y-6 text-sm">
                <div className="text-gray-500 font-bold">Combustible:</div>
                <div className="text-gray-900 font-medium text-right">{car.fuel || "-"}</div>
                
                <div className="text-gray-500 font-bold">Cambio:</div>
                <div className="text-gray-900 font-medium text-right">{car.transmission || "-"}</div>
                
                <div className="text-gray-500 font-bold">Año:</div>
                <div className="text-gray-900 font-medium text-right">{car.year || "-"}</div>
                
                <div className="text-gray-500 font-bold">Kilometraje:</div>
                <div className="text-gray-900 font-medium text-right">{kmFormateado} km</div>
              </div>
            </div>

            {/* Redes Sociales */}
            <div className="mb-8">
              <p className="text-sm text-gray-500 mb-3 font-medium">¡Compártelo en Redes Sociales!</p>
              <div className="flex gap-3">
                <button className="bg-[#1877F2] text-white w-12 h-10 rounded shadow flex items-center justify-center hover:bg-blue-700 transition">
                  <i className="fab fa-facebook-f"></i>
                </button>
                <a href={`https://wa.me/?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white w-12 h-10 rounded shadow flex items-center justify-center hover:bg-green-600 transition">
                  <i className="fab fa-whatsapp text-lg"></i>
                </a>
              </div>
            </div>

            {/* Formulario de Contacto Lateral */}
            <div className="bg-white border border-gray-100 shadow-xl rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#4da359]"></div>
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Solicitar Información</h3>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); window.open(`https://wa.me/34600000000?text=${whatsappMsg}`, '_blank'); }}>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Nombre" required className="bg-gray-50 border border-gray-200 p-3 rounded-lg w-full text-sm focus:outline-none focus:border-[#4da359]" />
                  <input type="tel" placeholder="Teléfono" required className="bg-gray-50 border border-gray-200 p-3 rounded-lg w-full text-sm focus:outline-none focus:border-[#4da359]" />
                </div>
                <textarea placeholder="¿En qué estás interesado?*" required defaultValue={`Hola, estoy interesado en el ${car.brand} ${car.model}.`} className="bg-gray-50 border border-gray-200 p-3 rounded-lg w-full h-24 text-sm focus:outline-none focus:border-[#4da359]"></textarea>
                <button className="w-full bg-[#111] hover:bg-[#222] text-white font-bold py-4 rounded-lg transition-colors flex justify-center items-center gap-2">
                  <i className="fab fa-whatsapp"></i> Contactar por WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* COCHES RELACIONADOS */}
        {relatedCars.length > 0 && (
          <div className="mt-24 border-t border-gray-100 pt-16">
            <h2 className="text-2xl font-extrabold text-[#111] mb-8">Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedCars.map(related => (
                <Link href={`/vehiculo/${related.id}`} key={related.id} className="group block">
                  <div className="bg-[#1e232e] rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-transform relative text-white h-full flex flex-col">
                    <div className="relative aspect-[4/3] w-full bg-gray-800">
                      <Image src={related.image || imagenSegura} alt={related.model} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
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
}