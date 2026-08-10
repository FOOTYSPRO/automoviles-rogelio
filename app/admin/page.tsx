"use client";
import { useState, useEffect } from 'react';
import { db, auth } from "../firebase";
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function AdminPanel() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) router.push("/admin/login");
      else setUser(u);
      setChecking(false);
    });
    return () => unsub();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMsg('Guardando...');
    const formData = new FormData(e.currentTarget);

    try {
      let imageUrl = "";
      if (imageFile) {
        const storage = getStorage();
        const storageRef = ref(storage, `vehiculos/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "vehiculos"), {
        brand: formData.get('brand'),
        model: formData.get('model'),
        price: Number(formData.get('price')),
        year: Number(formData.get('year')),
        km: formData.get('km'),
        kmNum: Number((formData.get('km') as string).replace(/\./g, '')),
        fuel: formData.get('fuel'),
        transmission: formData.get('transmission'),
        image: imageUrl,
        tag: formData.get('tag'),
        tagColor: 'bg-brand-orange',
        description: formData.get('description')
      });

      setMsg('✅ ¡Vehículo guardado correctamente en Firebase!');
      (e.target as HTMLFormElement).reset();
      setImageFile(null);
    } catch (error: any) {
      console.error(error);
      setMsg('❌ Error al guardar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (checking) return <p className="p-10 text-center">Comprobando acceso...</p>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#1E3A8A]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#1E3A8A]">Añadir Nuevo Vehículo</h1>
          <button onClick={() => signOut(auth)} className="text-sm text-gray-500 hover:text-red-600">Cerrar sesión</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="brand" type="text" placeholder="Marca (ej. Audi)" required className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#EA580C]" />
            <input name="model" type="text" placeholder="Modelo (ej. A3 Sportback)" required className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#EA580C]" />
            <input name="price" type="number" placeholder="Precio (€)" required className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#EA580C]" />
            <input name="year" type="number" placeholder="Año (ej. 2021)" required className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#EA580C]" />
            <input name="km" type="text" placeholder="Kilómetros (ej. 55.000)" required className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#EA580C]" />
            <select name="fuel" required className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#EA580C] bg-white">
                <option value="">Combustible...</option>
                <option value="Diésel">Diésel</option>
                <option value="Gasolina">Gasolina</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Eléctrico">Eléctrico</option>
            </select>
            <select name="transmission" required className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#EA580C] bg-white">
                <option value="">Transmisión...</option>
                <option value="Manual">Manual</option>
                <option value="Automático">Automático</option>
            </select>
            <input name="tag" type="text" placeholder="Etiqueta (ej. Ocasión, ECO)" className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#EA580C]" />
          </div>

          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="border border-gray-300 p-3 rounded-lg w-full"
          />

          <textarea name="description" placeholder="Descripción detallada del estado, mantenimientos, extras..." required className="border border-gray-300 p-3 rounded-lg w-full h-32 focus:outline-none focus:border-[#EA580C]"></textarea>

          <button type="submit" disabled={loading} className="w-full bg-[#1E3A8A] text-white font-bold py-4 rounded-lg hover:bg-blue-900 transition-colors disabled:bg-gray-400">
            {loading ? 'Subiendo datos...' : 'Guardar Vehículo en Catálogo'}
          </button>
        </form>

        {msg && <p className="mt-6 text-center font-medium text-lg">{msg}</p>}
      </div>
    </div>
  );
}