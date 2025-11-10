"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema } from "@/types/schemas";
import { toast } from "sonner";
import { gsap } from "gsap";

export default function LoginForm() {
  const { login, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(logoRef.current, {
        scale: 0,
        rotation: -180,
        duration: 0.6,
        ease: "back.out(1.7)",
      });

      gsap.from(formRef.current?.querySelectorAll(".form-field") || [], {
        opacity: 0,
        x: -20,
        stagger: 0.1,
        duration: 0.4,
        ease: "power2.out",
        delay: 0.3,
      });
    }, formRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const validation = loginSchema.safeParse(data);

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      toast.error(firstError.message);
      
      gsap.to(formRef.current, {
        keyframes: [
          { x: -10 },
          { x: 10 },
          { x: -10 },
          { x: 10 },
          { x: 0 }
        ],
        duration: 0.4,
        ease: "power2.inOut",
      });
      return;
    }

    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
      });
    }

    await login(data);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 p-6 rounded">
      <div ref={logoRef} className="md:flex-1 flex flex-col items-center justify-center">
        <Image
          src="/images/logo_sin_fondo_oscuro.png"
          alt="LimaUrban"
          width={64}
          height={64}
          className="object-contain mb-6"
        />
      </div>

      <div className="relative form-field">
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Correo
        </label>
        <div className="relative mt-1">
          <User className="absolute left-2 top-1/2 -translate-y-1/2" size={18} color="#00C48E" />
          <input
            id="email"
            name="email"
            type="email"
            required
            className="pl-10 py-2 block w-full rounded-[7px] border border-[#00C48E] text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00C48E] focus:border-[#00C48E]"
          />
        </div>
      </div>

      <div className="relative form-field">
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
          Contraseña
        </label>
        <div className="relative mt-1">
          <Lock className="absolute left-2 top-1/2 -translate-y-1/2" size={18} color="#00C48E" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            className="pl-10 pr-10 py-2 block w-full rounded-[7px] border border-[#00C48E] text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00C48E] focus:border-[#00C48E]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
          >
            {showPassword ? 
              <EyeOff size={18} color="#00C48E" /> : 
              <Eye size={18} color="#00C48E" />
            }
          </button>
        </div>
      </div>

      <div className="form-field">
        <button
          ref={buttonRef}
          type="submit"
          className="w-full inline-flex justify-center py-2 px-4 text-sm font-medium rounded-[7px] text-white bg-[#00C48E] hover:opacity-95 disabled:opacity-50 transition-all"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Ingresando...
            </span>
          ) : (
            "Iniciar sesión"
          )}
        </button>
      </div>

      <div className="text-center text-sm text-slate-600 form-field">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="text-[#00C48E] hover:underline font-medium transition-colors">
          Regístrate
        </Link>
      </div>
    </form>
  );
}
