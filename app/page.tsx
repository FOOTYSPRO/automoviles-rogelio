// app/page.tsx
import { db } from "./firebase";
import { collection, getDocs, limit, query } from "firebase/firestore";
import CatalogoInteractivo from "./components/CatalogoInteractivo";

export const revalidate = 60; // Refresca la caché en Vercel cada 60 segundos

// Punto 10: Interfaz TypeScript para evitar errores en producción
export interface Car {
  id: string;
  brand: string;
  model: string;
  price: number;
  year: number;
  km: string;
  fuel: string;
  transmission: string;
  image: string;
  tag?: string;
}

// Punto 1: Fetching en el servidor con límite (Punto 10)
async function getCars() {
  try {
    const q = query(collection(db, "vehiculos"), limit(20));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Car));
  } catch (error) {
    console.error("Error conectando con Firestore:", error);
    return null; // Punto 2: Devolvemos null para gestionar el error de conexión
  }
}

export default async function Home() {
  const initialCars = await getCars();

  // Punto 6: Datos Estructurados JSON-LD (Vital para el SEO de concesionarios)
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "name": "Automóviles Rogelio",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Marchena",
      "addressRegion": "Sevilla",
      "addressCountry": "ES"
    },
    "telephone": "+34600000000"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <CatalogoInteractivo initialCars={initialCars} />
    </>
  );
}