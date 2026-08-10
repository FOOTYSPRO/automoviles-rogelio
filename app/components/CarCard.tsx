// src/app/components/CarCard.tsx
import Link from "next/link";

export default function CarCard({ car }: { car: any }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
      <img src={car.image} alt={`${car.brand} ${car.model}`} className="w-full h-48 object-cover" />
      <div className="p-5">
        <h3 className="text-xl font-bold">{car.brand} {car.model}</h3>
        <p className="text-2xl font-bold text-[#1E3A8A] mt-2">{Number(car.price).toLocaleString('es-ES')}€</p>
        <div className="grid grid-cols-2 gap-2 mt-4 text-sm text-gray-600">
          <p>Año: {car.year}</p>
          <p>Km: {car.km}</p>
        </div>
        <Link href={`/vehiculo/${car.id}`} className="mt-4 block text-center bg-[#EA580C] text-white py-2 rounded-lg font-semibold hover:bg-orange-700">
          Ver Detalles
        </Link>
      </div>
    </div>
  );
}