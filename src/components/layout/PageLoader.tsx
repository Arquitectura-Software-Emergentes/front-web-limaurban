"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface PageLoaderProps {
  message?: string;
}

export default function PageLoader({ message = "Cargando..." }: PageLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animación de entrada del contenedor
      gsap.from(containerRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.out",
      });

      // Animación del spinner
      gsap.from(spinnerRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.4,
        ease: "back.out(1.7)",
      });

      // Animación del texto
      gsap.from(textRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.3,
        delay: 0.2,
        ease: "power2.out",
      });

      // Animación de rotación continua del spinner
      gsap.to(spinnerRef.current, {
        rotation: 360,
        duration: 1.2,
        ease: "none",
        repeat: -1,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#132D46]/95 backdrop-blur-md"
      style={{ pointerEvents: 'auto' }}
    >
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div
            ref={spinnerRef}
            className="w-16 h-16 rounded-full border-4 border-[#345473] border-t-[#00C48E] border-r-[#00C48E]/70"
          />
        </div>

        <p ref={textRef} className="text-white text-lg font-medium mb-2">
          {message}
        </p>
        
        <div className="flex gap-1 justify-center">
          <span className="w-2 h-2 bg-[#00C48E] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-[#00C48E] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-[#00C48E] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
