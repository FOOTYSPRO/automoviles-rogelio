import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 1. Importamos el componente Footer
import Footer from "./components/Footer"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ¡Metadatos actualizados para el SEO del concesionario!
export const metadata: Metadata = {
  title: "Automóviles Rogelio | Coches de Ocasión en Marchena",
  description: "Tu concesionario de confianza en Marchena. Vehículos de ocasión y segunda mano 100% revisados, garantizados y con financiación a tu medida.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Enlace para cargar los iconos profesionales */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
        />
      </head>
      <body className="min-h-full flex flex-col">
        
        {/* Envolvemos children en flex-grow para empujar el Footer siempre abajo */}
        <div className="flex-grow">
          {children}
        </div>
        
        {/* 2. Colocamos el Footer al final */}
        <Footer />
        
      </body>
    </html>
  );
}