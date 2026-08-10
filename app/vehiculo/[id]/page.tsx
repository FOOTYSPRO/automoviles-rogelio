// src/app/vehiculo/[id]/page.tsx
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";

export default async function CarDetails({ params }: { params: { id: string } }) {
  const docRef = doc(db, "vehiculos", params.id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    notFound(); // Muestra página 404 si el coche no existe
  }

  const car = docSnap.data();

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <img src={car.image} alt={car.model} className="w-full h-96 object-cover rounded-xl shadow-lg mb-8" />
      <h1 className="text-4xl font-bold">{car.brand} {car.model}</h1>
      <p className="text-3xl font-bold text-[#1E3A8A] mt-4">{Number(car.price).toLocaleString('es-ES')} €</p>
      <p className="mt-6 text-gray-700">{car.description}</p>
      {/* Añade aquí los botones de contacto (WhatsApp, etc.) */}
    </main>
  );
}