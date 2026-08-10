import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";

export default async function CarDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const docRef = doc(db, "vehiculos", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    notFound();
  }

  const car = docSnap.data();

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <img src={car.image} alt={car.model} className="w-full h-96 object-cover rounded-xl shadow-lg mb-8" />
      <h1 className="text-4xl font-bold">{car.brand} {car.model}</h1>
      <p className="text-3xl font-bold text-[#1E3A8A] mt-4">{Number(car.price).toLocaleString('es-ES')} €</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-sm text-gray-600 border-y border-gray-100 py-4">
        <div><i className="far fa-calendar-alt text-[#4da359] mr-2"></i>{car.year}</div>
        <div><i className="fas fa-tachometer-alt text-[#4da359] mr-2"></i>{car.km}</div>
        <div><i className="fas fa-gas-pump text-[#4da359] mr-2"></i>{car.fuel}</div>
        <div><i className="fas fa-cogs text-[#4da359] mr-2"></i>{car.transmission}</div>
      </div>
      <p className="mt-6 text-gray-700">{car.description}</p>
      <div className="mt-8 flex gap-4">
        
          href={`https://wa.me/34600000000?text=${encodeURIComponent(`Hola, me interesa el ${car.brand} ${car.model}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl"
        >
          Consultar por WhatsApp
        </a>
        <a href="tel:+34600000000" className="bg-[#1E3A8A] text-white font-bold px-6 py-3 rounded-xl">
          Llamar
        </a>
      </div>
    </main>
  );
}