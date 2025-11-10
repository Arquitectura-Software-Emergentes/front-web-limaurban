"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";

export default function AuthLoading() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(logoRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.4,
        ease: "power2.out",
      });

      gsap.from(textRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.3,
        delay: 0.2,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#132D46] via-[#0F2537] to-[#132D46]"
    >
      <div className="text-center">
        <div ref={logoRef} className="mb-4">
          <Image
            src="/images/logo_sin_fondo_claro.png"
            alt="LimaUrban"
            width={80}
            height={80}
            className="object-contain mx-auto"
          />
        </div>

        <p ref={textRef} className="text-white text-lg font-medium">
          Verificando sesión...
        </p>
      </div>
    </div>
  );
}
