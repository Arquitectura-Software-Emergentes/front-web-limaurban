"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Lock, Eye, EyeOff, Mail, Phone, UserCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Role } from "@/types";
import { registerSchema } from "@/types/schemas";
import { toast } from "sonner";

export default function RegisterForm() {
  const { register, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      fullName: formData.get("fullName") as string,
      phone: formData.get("phone") as string,
      userType: (formData.get("userType") as Role) || 'CITIZEN',
    };

    const validation = registerSchema.safeParse(data);

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      toast.error(firstError.message);
      return;
    }

    await register({
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      phone: data.phone || undefined,
      role: data.userType,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded">
      <div className="md:flex-1 flex flex-col items-center justify-center">
        <Image
          src="/images/logo_sin_fondo_oscuro.png"
          alt="LimaUrban"
          width={64}
          height={64}
          className="object-contain mb-6"
        />
      </div>

      <div className="relative">
        <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">
          Nombre completo
        </label>
        <div className="relative mt-1">
          <UserCircle className="absolute left-2 top-1/2 -translate-y-1/2" size={18} color="#00C48E" />
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            className="pl-10 py-2 block w-full rounded-[7px] border border-[#00C48E] text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00C48E] focus:border-[#00C48E]"
          />
        </div>
      </div>

      <div className="relative">
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Correo electrónico
        </label>
        <div className="relative mt-1">
          <Mail className="absolute left-2 top-1/2 -translate-y-1/2" size={18} color="#00C48E" />
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
        <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
          Teléfono (opcional)
        </label>
        <div className="relative mt-1">
          <Phone className="absolute left-2 top-1/2 -translate-y-1/2" size={18} color="#00C48E" />
          <input
            id="phone"
            name="phone"
            type="tel"
            className="pl-10 py-2 block w-full rounded-[7px] border border-[#00C48E] text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00C48E] focus:border-[#00C48E]"
          />
        </div>
      </div>

      <div className="relative">
        <label htmlFor="userType" className="block text-sm font-medium text-slate-700">
          Tipo de usuario
        </label>
        <div className="relative mt-1">
          <User className="absolute left-2 top-1/2 -translate-y-1/2" size={18} color="#00C48E" />
          <select
            id="userType"
            name="userType"
            required
            defaultValue="CITIZEN"
            className="pl-10 py-2 block w-full rounded-[7px] border border-[#00C48E] text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00C48E] focus:border-[#00C48E]"
          >
            <option value="CITIZEN">Ciudadano</option>
            <option value="MUNICIPALITY_STAFF">Personal Municipal</option>
          </select>
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

      <div className="relative">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
          Confirmar contraseña
        </label>
        <div className="relative mt-1">
          <Lock className="absolute left-2 top-1/2 -translate-y-1/2" size={18} color="#00C48E" />
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            required
            className="pl-10 pr-10 py-2 block w-full rounded-[7px] border border-[#00C48E] text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00C48E] focus:border-[#00C48E]"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            {showConfirmPassword ? 
              <EyeOff size={18} color="#00C48E" /> : 
              <Eye size={18} color="#00C48E" />
            }
          </button>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="w-full inline-flex justify-center py-2 px-4 text-sm font-medium rounded-[7px] text-white bg-[#00C48E] hover:opacity-95 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </div>

      <div className="text-center text-sm text-slate-600">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-[#00C48E] hover:underline">
          Inicia sesión
        </Link>
      </div>
    </form>
  );
}
