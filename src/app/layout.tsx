import React from "react";
import { Toaster } from "sonner";
import "../styles/globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "LimaUrban - Gestión de Incidentes Urbanos",
  description: "Sistema de reporte y gestión de incidentes urbanos en Lima, Perú",
  icons: {
    icon: "/images/logo_sin_fondo_oscuro.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="min-h-screen bg-[#1A1E29]">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}

