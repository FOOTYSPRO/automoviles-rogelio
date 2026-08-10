// src/app/page.tsx
import { db } from "../lib/firebase";
import { collection, getDocs, query, limit } from "firebase/firestore";
import CarCard from "./components/CarCard"; // Lo crearemos después

// Esta función obtiene los datos de Firebase en el servidor
async function getFeaturedCars() {
  try {
    // Query para obtener los 3 primeros coches (destacados)
    const q = query(collection(db, "vehiculos"), limit(3));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[]; // Idealmente, define una interfaz 'Car'
  } catch (error) {
    console.error("Error fetching cars:", error);
    return [];
  }
}

// Fuerza a Next.js a regenerar la página periódicamente (ISR)
export const revalidate = 60; // Revalida cada 60 segundos si hay cambios en Firebase

export default async function Home() {
  const cars = await getFeaturedCars();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header/Hero Section - Reutiliza el HTML de Tailwind que te pasé antes */}
      <section className="bg-[#1E3A8A] text-white py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">Automóviles Rogelio</h1>
        <p className="text-xl">Confianza y Experiencia en Marchena</p>
      </section>

      {/* Vehículos Destacados */}
      <section className="max-w-7xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-[#1E3A8A] mb-8 text-center">Vehículos Destacados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </section>
    </main>
  );
}