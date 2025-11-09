import React from "react";
import { Toaster } from "sonner";
import "../styles/globals.css";

export const metadata = {
  title: "LimaUrban",
  description: "Sistema de gestión LimaUrban",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[#1A1E29]">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}

