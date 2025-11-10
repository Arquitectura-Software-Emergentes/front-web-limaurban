"use client";

import { useEffect, useState } from "react";

interface ErrorDisplayProps {
  serverError: string;
}

export default function ErrorDisplay({ serverError }: ErrorDisplayProps) {
  const [displayError, setDisplayError] = useState(serverError);

  useEffect(() => {
    // Leer el hash fragment del navegador (solo disponible en client-side)
    if (typeof window !== "undefined" && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const hashError = hashParams.get("error_description") || hashParams.get("error");
      
      if (hashError) {
        // Decodificar y limpiar el mensaje
        const decodedError = decodeURIComponent(hashError.replace(/\+/g, " "));
        setDisplayError(decodedError);
      }
    }
  }, []);

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
      <p className="text-sm text-red-800 break-words">
        {displayError}
      </p>
    </div>
  );
}
