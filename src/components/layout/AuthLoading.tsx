"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function AuthLoading() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const dotsRef = useRef<HTMLSpanElement>(null);

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
          textRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.4,
            ease: "power2.out",
          },
          "-=0.2"
        )
        .to(logoRef.current, {
          rotation: 360,
          duration: 2,
          repeat: -1,
          ease: "linear",
        });

      gsap.to(dotsRef.current?.children || [], {
        opacity: 0.3,
        stagger: {
          each: 0.3,
          repeat: -1,
          yoyo: true,
        },
        duration: 0.3,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <div className="text-center">
        <div
          ref={logoRef}
          className="inline-block mb-6 relative"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur opacity-30"></div>
        </div>

        <p ref={textRef} className="text-gray-700 text-base font-medium mb-2">
          Verificando sesión
          <span ref={dotsRef} className="inline-block ml-1">
            <span className="inline-block">.</span>
            <span className="inline-block">.</span>
            <span className="inline-block">.</span>
          </span>
        </p>
        <p className="text-gray-500 text-sm">Por favor espera un momento</p>
      </div>
    </div>
  );
}
