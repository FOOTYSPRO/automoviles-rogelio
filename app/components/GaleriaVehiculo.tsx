"use client";

import { useState } from "react";

export default function GaleriaVehiculo({ images, altText }: { images: string[], altText: string }) {
  // Guardamos la primera foto como la imagen destacada por defecto
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div>
      {/* Imagen Principal */}
      <div className="relative aspect-[4/3] w-full bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-4 transition-all duration-300">
        <img src={mainImage} alt={altText} className="w-full h-full object-cover" />
      </div>
      
      {/* Miniaturas (Solo se muestran si hay más de 1 foto) */}
      {images.length > 1 && (
        <div className="flex gap-2 md:gap-4 overflow-x-auto pb-4 mb-8">
          {images.map((img, index) => (
            <div 
              key={index} 
              onClick={() => setMainImage(img)}
              className={`relative aspect-[4/3] w-24 md:w-32 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                mainImage === img 
                  ? 'border-[#b18b2c] opacity-100 shadow-md' 
                  : 'border-transparent hover:border-gray-300 opacity-60 hover:opacity-100'
              }`}
            >
               <img src={img} alt={`${altText} miniatura ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}