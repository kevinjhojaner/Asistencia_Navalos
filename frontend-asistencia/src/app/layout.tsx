// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // O puedes usar 'Geist' si lo prefieres
import "./globals.css";
import Navbar from "../components/Navbar"; // Usamos ruta relativa

const inter = Inter({ subsets: ["latin"] }); // O configura 'Geist' aquí

export const metadata: Metadata = {
  title: "Control Asistencia Navalos",
  description: "Aplicación para el control de asistencia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {/* Asegúrate de que no haya NADA entre esta línea y la siguiente */}
      <body className={inter.className}> {/* O usa las clases de Geist si lo cambiaste */}
        <Navbar />
        <main className="container mx-auto p-4">
           {children}
        </main>
      </body>
    </html>
  );
}