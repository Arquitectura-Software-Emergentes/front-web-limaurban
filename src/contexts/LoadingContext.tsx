"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import PageLoader from "@/components/layout/PageLoader";

interface LoadingContextType {
  isLoading: boolean;
  showLoader: (message?: string) => void;
  hideLoader: () => void;
  setLoadingMessage: (message: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("Cargando...");

  const showLoader = useCallback((msg?: string) => {
    if (msg) setMessage(msg);
    setIsLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    setIsLoading(false);
    setMessage("Cargando...");
  }, []);

  const setLoadingMessage = useCallback((msg: string) => {
    setMessage(msg);
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, showLoader, hideLoader, setLoadingMessage }}>
      {children}
      {isLoading && <PageLoader message={message} />}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
