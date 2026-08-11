"use client";

import { useState, useEffect } from "react";
import { db, storage, auth } from "../firebase";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CAR_DATABASE: Record<string, string[]> = {
  "Audi": ["A1", "A3", "A4", "A5", "A6", "Q2", "Q3", "Q5", "Q7", "Q8"],
  "BMW": ["Serie 1", "Serie 2", "Serie 3", "Serie 4", "Serie 5", "X1", "X2", "X3", "X4", "X5"],
  "Mercedes-Benz": ["Clase A", "Clase C", "Clase E", "GLA", "GLB", "GLC", "GLE"],
  "Volkswagen": ["Polo", "Golf", "Passat", "Tiguan", "T-Roc", "T-Cross", "Touareg"],
  "SEAT": ["Ibiza", "León", "Arona", "Ateca", "Tarraco"],
  "Peugeot": ["208", "308", "2008", "3008", "5008"],
  "Toyota": ["Yaris", "Corolla", "C-HR", "RAV4", "Hilux"],
  "Renault": ["Clio", "Megane", "Captur", "Kadjar", "Austral"],
  "Ford": ["Fiesta", "Focus", "Puma", "Kuga", "Mustang"],
};

export default function AdminPanel() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  const [view, setView] = useState<"list" | "form" | "leads" | "mensajes">("form");
  const [cars, setCars] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [mensajes, setMensajes] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // AÑADIDO: month y power al estado inicial
  const [formData, setFormData] = useState({
    brand: "", model: "", price: "", year: "", month: "", power: "", km: "",
    fuel: "", transmission: "", tag: "", description: ""
  });
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthorized(true);
      } else {
        router.push("/admin/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchCars = async () => {
    const querySnapshot = await getDocs(collection(db, "vehiculos"));
    setCars(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchLeads = async () => {
    const querySnapshot = await getDocs(collection(db, "suscriptores"));
    setLeads(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchMensajes = async () => {
    const querySnapshot = await getDocs(collection(db, "mensajes_contacto"));
    const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    msgs.sort((a: any, b: any) => b.fecha?.seconds - a.fecha?.seconds);
    setMensajes(msgs);
  };

  useEffect(() => {
    if (view === "list" && isAuthorized) fetchCars();
    if (view === "leads" && isAuthorized) fetchLeads();
    if (view === "mensajes" && isAuthorized) fetchMensajes();
  }, [view, isAuthorized]);

  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const startEditing = (car: any) => {
    setEditingId(car.id);
    setFormData({
      brand: car.brand || "", model: car.model || "", price: car.price?.toString() || "", 
      year: car.year?.toString() || "", month: car.month || "", power: car.power?.toString() || "", 
      km: car.km?.toString() || "", fuel: car.fuel || "", transmission: car.transmission || "", 
      tag: car.tag || "", description: car.description || ""
    });
    setImages(car.images || (car.image ? [car.image] : []));
    setView("form");
    window.scrollTo(0, 0);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ brand: "", model: "", price: "", year: "", month: "", power: "", km: "", fuel: "", transmission: "", tag: "", description: "" });
    setImages([]);
    setMessage({ text: "", type: "" });
  };

  const handleFileUpload = async (e: any) => {
    const files = Array.from(e.target.files) as File[];
    if (files.length === 0) return;
    
    setUploadingImage(true);
    try {
      const newUrls = [...images];
      for (const file of files) {
        const storageRef = ref(storage, `vehiculos/${Date.now()}_${file.name.replace(/\s/g, "_")}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        newUrls.push(url);
      }
      setImages(newUrls);
    } catch (error) {
      alert("Error subiendo imagen");
    } finally {
      setUploadingImage(false);
    }
  };

  const moveImage = (index: number, direction: "left" | "right") => {
    if (direction === "left" && index === 0) return;
    if (direction === "right" && index === images.length - 1) return;
    const newImages = [...images];
    const swapIndex = direction === "left" ? index - 1 : index + 1;
    [newImages[index], newImages[swapIndex]] = [newImages[swapIndex], newImages[index]];
    setImages(newImages);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "Guardando vehículo...", type: "loading" });

    try {
      const docData = {
        ...formData,
        price: Number(formData.price),
        year: Number(formData.year),
        km: formData.km.toString(),
        image: images[0] || "",
        images: images,
        updatedAt: new Date()
      };

      if (editingId) {
        await updateDoc(doc(db, "vehiculos", editingId), docData);
        setMessage({ text: "¡Vehículo actualizado correctamente!", type: "success" });
      } else {
        await addDoc(collection(db, "vehiculos"), { ...docData, createdAt: new Date() });
        setMessage({ text: "¡Vehículo publicado con éxito!", type: "success" });
        resetForm();
      }
    } catch (error: any) {
      setMessage({ text: "Error: " + error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres borrar este coche? Esta acción no se puede deshacer.")) {
      await deleteDoc(doc(db, "vehiculos", id));
      fetchCars();
    }
  };

  const handleDeleteMensaje = async (id: string) => {
    if (window.confirm("¿Borrar este mensaje?")) {
      await deleteDoc(doc(db, "mensajes_contacto", id));
      fetchMensajes();
    }
  };

  const availableModels = CAR_DATABASE[formData.brand] || [];

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4da359]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      
      <aside className="w-64 bg-[#111] text-white flex flex-col shadow-2xl hidden md:flex fixed h-full z-10">
        <div className="p-6 border-b border-gray-800">
          <Link href="/">
            <h2 className="text-xl font-extrabold text-[#4da359] uppercase tracking-wide cursor-pointer hover:text-white transition">Admin Panel</h2>
          </Link>
          <p className="text-xs text-gray-400 mt-1">Automóviles Rogelio</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 flex flex-col">
          <button onClick={() => { resetForm(); setView("form"); }} className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${view === "form" && !editingId ? "bg-[#4da359] text-white shadow" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}>
            <i className="fas fa-plus-circle mr-2"></i> Nuevo Vehículo
          </button>
          <button onClick={() => setView("list")} className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${view === "list" ? "bg-[#4da359] text-white shadow" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}>
            <i className="fas fa-car mr-2"></i> Inventario
          </button>
          <button onClick={() => setView("leads")} className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${view === "leads" ? "bg-[#4da359] text-white shadow" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}>
            <i className="fas fa-users mr-2"></i> Suscriptores
          </button>
          <button onClick={() => setView("mensajes")} className={`w-full text-left px-4 py-3 rounded-lg font-medium transition mb-6 ${view === "mensajes" ? "bg-[#4da359] text-white shadow" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}>
            <i className="fas fa-envelope mr-2"></i> Mensajes <span className="float-right bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{mensajes.length}</span>
          </button>
          
          <button onClick={() => signOut(auth)} className="w-full text-left px-4 py-3 rounded-lg font-medium text-red-400 hover:text-red-300 hover:bg-gray-800 transition mt-auto">
            <i className="fas fa-sign-out-alt mr-2"></i> Cerrar Sesión
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-10 md:ml-64">
        <div className="max-w-5xl mx-auto">
          
          {view === "list" && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Inventario Actual</h1>
                <span className="bg-[#4da359] text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">{cars.length} Coches</span>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehículo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio / Año</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cars.length === 0 ? (
                      <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">No hay vehículos en el catálogo.</td></tr>
                    ) : (
                      cars.map((car) => (
                        <tr key={car.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 whitespace-nowrap flex items-center">
                            <div className="h-12 w-16 flex-shrink-0 bg-gray-200 rounded overflow-hidden mr-4">
                              <img src={car.image || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=200"} alt="" className="h-full w-full object-cover" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-gray-900">{car.brand} {car.model}</div>
                              <div className="text-xs text-gray-500">{car.km ? Number(String(car.km).replace(/\./g, '')).toLocaleString('es-ES') : "0"} km</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-[#b18b2c]">{car.price ? Number(car.price).toLocaleString('es-ES') : "0"}€</div>
                            <div className="text-xs text-gray-500">{car.year}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => startEditing(car)} className="text-[#4da359] hover:text-green-900 mr-4 font-bold"><i className="fas fa-edit mr-1"></i> Editar</button>
                            <button onClick={() => handleDelete(car.id)} className="text-red-500 hover:text-red-900 font-bold"><i className="fas fa-trash-alt mr-1"></i> Borrar</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {view === "form" && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{editingId ? "Editar Vehículo" : "Añadir Vehículo"}</h1>
                  <p className="text-gray-500 mt-2">Los cambios se reflejarán instantáneamente en la web.</p>
                </div>
                {editingId && (
                  <button onClick={() => { resetForm(); setView("list"); }} className="text-gray-500 hover:text-gray-900 font-medium border border-gray-300 px-4 py-2 rounded-lg">
                    Cancelar Edición
                  </button>
                )}
              </div>

              {message.text && (
                <div className={`p-4 rounded-xl mb-8 font-medium ${message.type === 'success' ? 'bg-green-100 text-green-800' : message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                
                <div className="p-8 border-b border-gray-100 bg-gray-50">
                  <div className="flex justify-between items-end mb-4">
                    <h3 className="text-lg font-bold text-gray-900"><i className="far fa-images text-[#4da359] mr-2"></i> Galería de Fotos ({images.length})</h3>
                    <label className="cursor-pointer bg-[#111] hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold shadow transition">
                      <i className="fas fa-upload mr-2"></i> Subir Fotos
                      <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="sr-only" />
                    </label>
                  </div>
                  
                  {uploadingImage && <div className="text-sm text-blue-600 font-medium animate-pulse mb-4"><i className="fas fa-spinner fa-spin mr-1"></i> Subiendo imágenes a la nube...</div>}

                  <div className="flex gap-4 overflow-x-auto pb-4 pt-2">
                    {images.length === 0 ? (
                      <div className="w-full py-10 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-400">Ninguna foto subida aún.</div>
                    ) : (
                      images.map((url, index) => (
                        <div key={index} className="relative w-40 h-32 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 shadow group">
                          <img src={url} alt={`Foto ${index}`} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition shadow flex items-center justify-center"><i className="fas fa-times text-xs"></i></button>
                          <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
                            <button type="button" onClick={() => moveImage(index, "left")} disabled={index === 0} className="bg-black/70 text-white w-6 h-6 rounded flex items-center justify-center disabled:opacity-30"><i className="fas fa-chevron-left text-xs"></i></button>
                            <button type="button" onClick={() => moveImage(index, "right")} disabled={index === images.length - 1} className="bg-black/70 text-white w-6 h-6 rounded flex items-center justify-center disabled:opacity-30"><i className="fas fa-chevron-right text-xs"></i></button>
                          </div>
                          {index === 0 && <span className="absolute top-0 left-0 bg-[#4da359] text-white text-[10px] uppercase px-2 py-1 font-bold rounded-br-lg shadow">Portada</span>}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-6"><i className="fas fa-list text-[#4da359] mr-2"></i> Detalles Técnicos</h3>
                  <datalist id="brands-list">{Object.keys(CAR_DATABASE).map(b => <option key={b} value={b} />)}</datalist>
                  <datalist id="models-list">{availableModels.map(m => <option key={m} value={m} />)}</datalist>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Marca</label>
                      <input list="brands-list" name="brand" value={formData.brand} onChange={handleInputChange} required className="w-full bg-gray-50 text-gray-900 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-[#4da359]" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Modelo</label>
                      <input list="models-list" name="model" value={formData.model} onChange={handleInputChange} required className="w-full bg-gray-50 text-gray-900 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-[#4da359]" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Precio (€)</label>
                      <input type="number" name="price" value={formData.price} onChange={handleInputChange} required className="w-full bg-gray-50 text-gray-900 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-[#4da359]" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Año</label>
                      <input type="number" name="year" value={formData.year} onChange={handleInputChange} required className="w-full bg-gray-50 text-gray-900 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-[#4da359]" />
                    </div>
                    
                    {/* AÑADIDO: Mes de matriculación */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Mes de matriculación</label>
                      <select name="month" value={formData.month} onChange={handleInputChange} className="w-full bg-gray-50 text-gray-900 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-[#4da359]">
                        <option value="">Seleccionar...</option>
                        <option value="Enero">Enero</option>
                        <option value="Febrero">Febrero</option>
                        <option value="Marzo">Marzo</option>
                        <option value="Abril">Abril</option>
                        <option value="Mayo">Mayo</option>
                        <option value="Junio">Junio</option>
                        <option value="Julio">Julio</option>
                        <option value="Agosto">Agosto</option>
                        <option value="Septiembre">Septiembre</option>
                        <option value="Octubre">Octubre</option>
                        <option value="Noviembre">Noviembre</option>
                        <option value="Diciembre">Diciembre</option>
                      </select>
                    </div>

                    {/* AÑADIDO: Potencia */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Potencia (CV)</label>
                      <input type="text" name="power" value={formData.power} onChange={handleInputChange} placeholder="Ej. 150" className="w-full bg-gray-50 text-gray-900 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-[#4da359]" />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Kilómetros</label>
                      <input type="text" name="km" value={formData.km} onChange={handleInputChange} required placeholder="Ej. 104302 (sin puntos)" className="w-full bg-gray-50 text-gray-900 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-[#4da359]" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Etiqueta Promocional</label>
                      <input type="text" name="tag" value={formData.tag} onChange={handleInputChange} placeholder="Ej. RECIÉN LLEGADO o VENDIDO" className="w-full bg-gray-50 text-gray-900 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-[#4da359]" />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Combustible</label>
                      <select name="fuel" value={formData.fuel} onChange={handleInputChange} required className="w-full bg-gray-50 text-gray-900 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-[#4da359]">
                        <option value="">Seleccionar...</option><option value="Diésel">Diésel</option><option value="Gasolina">Gasolina</option><option value="Híbrido">Híbrido</option><option value="Eléctrico">Eléctrico</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Transmisión</label>
                      <select name="transmission" value={formData.transmission} onChange={handleInputChange} required className="w-full bg-gray-50 text-gray-900 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-[#4da359]">
                        <option value="">Seleccionar...</option><option value="Manual">Manual</option><option value="Automático">Automático</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción y Equipamiento (Opcional)</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows={5} className="w-full bg-gray-50 text-gray-900 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-[#4da359]"></textarea>
                  </div>
                </div>

                <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
                  {editingId && (<button type="button" onClick={() => { resetForm(); setView("list"); }} className="px-6 py-4 rounded-xl font-bold text-gray-600 bg-white border border-gray-300 hover:bg-gray-100 transition">Cancelar</button>)}
                  <button type="submit" disabled={loading || uploadingImage} className={`px-8 py-4 rounded-xl font-bold text-white transition-all shadow-md ${loading || uploadingImage ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#111] hover:bg-[#4da359]'}`}>
                    {loading ? <><i className="fas fa-spinner fa-spin mr-2"></i> Guardando...</> : editingId ? "Actualizar Vehículo" : "Publicar Vehículo"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {view === "leads" && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Base de Datos de Clientes</h1>
                  <p className="text-gray-500 mt-1">Correos captados a través del Footer.</p>
                </div>
                <span className="bg-[#111] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm">{leads.length} Emails</span>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leads.length === 0 ? (
                      <tr><td colSpan={2} className="px-6 py-8 text-center text-gray-500">Aún no hay suscriptores.</td></tr>
                    ) : (
                      leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900"><i className="far fa-envelope text-[#4da359] mr-2"></i> {lead.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.fecha ? new Date(lead.fecha.seconds * 1000).toLocaleDateString("es-ES") : ""}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {view === "mensajes" && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Bandeja de Entrada</h1>
                  <p className="text-gray-500 mt-1">Mensajes enviados desde la página de contacto.</p>
                </div>
                <span className="bg-[#111] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm">{mensajes.length} Mensajes</span>
              </div>
              
              <div className="space-y-6">
                {mensajes.length === 0 ? (
                  <div className="bg-white p-10 text-center rounded-2xl shadow-sm border border-gray-100">
                    <i className="far fa-comments text-5xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500 font-medium">Bandeja vacía. Aún no tienes mensajes.</p>
                  </div>
                ) : (
                  mensajes.map((msg) => (
                    <div key={msg.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 relative group overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#4da359]"></div>
                      <button onClick={() => handleDeleteMensaje(msg.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition"><i className="fas fa-trash"></i></button>
                      
                      <div className="flex flex-col md:flex-row justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{msg.nombre}</h3>
                          <div className="flex gap-4 text-sm font-medium text-gray-500 mt-1">
                            <span><i className="far fa-envelope mr-1"></i> {msg.email}</span>
                            {msg.telefono && <span><i className="fas fa-phone-alt mr-1"></i> {msg.telefono}</span>}
                          </div>
                        </div>
                        <div className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full h-fit mt-2 md:mt-0">
                          {msg.fecha ? new Date(msg.fecha.seconds * 1000).toLocaleString("es-ES") : ""}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm whitespace-pre-line border border-gray-100">
                        {msg.mensaje}
                      </div>
                      
                      <div className="mt-4 flex gap-3">
                        <a href={`mailto:${msg.email}`} className="text-sm font-bold text-[#4da359] hover:text-green-800 transition"><i className="fas fa-reply mr-1"></i> Responder Email</a>
                        {msg.telefono && (
                          <a href={`https://wa.me/34${msg.telefono.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#25D366] hover:text-green-800 transition"><i className="fab fa-whatsapp mr-1"></i> Escribir WhatsApp</a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}