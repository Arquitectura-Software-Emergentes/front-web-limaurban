"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { Home } from "lucide-react";

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(logoRef.current, {
        scale: 0,
        rotation: -180,
        duration: 0.6,
        ease: "back.out(1.7)",
      })
        .from(
          numberRef.current,
          {
            opacity: 0,
            y: 50,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3"
        )
        .from(
          numberRef.current?.querySelectorAll(".digit") || [],
          {
            opacity: 0,
            y: 20,
            stagger: 0.1,
            duration: 0.4,
            ease: "power2.out",
          },
          "-=0.3"
        )
        .from(
          contentRef.current,
          {
            opacity: 0,
            y: 30,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.2"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-[#132D46] via-[#0F2537] to-[#132D46] flex items-center justify-center p-4"
    >
      <div className="text-center max-w-2xl mx-auto">
        <div ref={logoRef} className="flex justify-center mb-8">
          <Image
            src="/images/logo_sin_fondo_claro.png"
            alt="LimaUrban"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>

        <div ref={numberRef} className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <span className="digit text-8xl md:text-9xl font-bold text-white">
              4
            </span>
            <span className="digit text-8xl md:text-9xl font-bold text-[#00C48E]">
              0
            </span>
            <span className="digit text-8xl md:text-9xl font-bold text-white">
              4
            </span>
          </div>
        </div>

        <div ref={contentRef} className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Página no encontrada
          </h1>
          <p className="text-lg text-gray-300 max-w-md mx-auto">
            La página que buscas no existe o ha sido movida.
          </p>

          <Link href="/">
            <button className="flex items-center gap-2 px-8 py-3 bg-[#00C48E] text-white rounded-lg hover:opacity-90 transition-opacity mx-auto mt-8">
              <Home size={20} />
              Volver al inicio
            </button>
          </Link>
        </div>

        <div className="mt-12 text-gray-500 text-sm">
          LimaUrban © {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
