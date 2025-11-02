"use client";

import React, { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import DashboardPage from "../../app/(dashboard)/dashboard/page";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      // Confirmación en consola con emoji
      console.log("✅ Usuario ingresó exitosamente:", email);
      // Redirige o actualiza el estado de la app si el login es exitoso
      router.push('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded">
        <div className="md:flex-1 flex flex-col items-center justify-center">
          <img
            src="\images\logo_sin_fondo_oscuro.png"
            alt="LimaUrban"
            className="h-16 object-contain mb-6"
          />
        </div>
      <div className="relative">
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

      <div className="relative">
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
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            {showPassword ? 
              <EyeOff size={18} color="#00C48E" /> : 
              <Eye size={18} color="#00C48E" />
            }
          </button>
        </div>
      </div>
      <div>
        <button
          type="submit"
          className="w-full inline-flex justify-center py-2 px-4 text-sm font-medium rounded-[7px] text-white bg-[#00C48E] hover:opacity-95"
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </div>
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
    </form>
  );
}
