"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLoading } from "@/contexts/LoadingContext";

export default function NavigationLoader() {
  const pathname = usePathname();
  const { hideLoader } = useLoading();

  useEffect(() => {
    // Esperar un momento para que el contenido esté renderizado
    // Solo para rutas que NO son /maps (que tiene su propio control)
    if (!pathname.includes('/maps')) {
      const timer = setTimeout(() => {
        hideLoader();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, hideLoader]);

  return null;
}
