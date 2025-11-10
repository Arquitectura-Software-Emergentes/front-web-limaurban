"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";

interface AuthPageTransitionProps {
  children: ReactNode;
}

export default function AuthPageTransition({ children }: AuthPageTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.5,
        ease: "power2.out",
      });

      gsap.from(containerRef.current?.querySelectorAll(".auth-element") || [], {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      {children}
    </div>
  );
}
