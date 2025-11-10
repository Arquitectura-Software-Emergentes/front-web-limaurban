"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLoading } from "@/contexts/LoadingContext";

export function usePageTransition() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { showLoader, hideLoader } = useLoading();

  useEffect(() => {
    // Ocultar el loader cuando la página termine de cargar
    hideLoader();
  }, [pathname, searchParams, hideLoader]);

  return { showLoader, hideLoader };
}
