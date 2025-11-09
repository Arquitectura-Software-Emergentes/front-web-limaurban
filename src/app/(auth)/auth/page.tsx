"use client";

import { useState, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { User, Lock, Eye, EyeOff, Mail, Phone, UserCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { UserType } from "@/types";
import { loginSchema, registerSchema } from "@/types/schemas";
import { toast } from "sonner";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login, register, loading } = useAuth();

  const logoRef = useRef<HTMLDivElement>(null);
  const loginFormRef = useRef<HTMLFormElement>(null);
  const registerFormRef = useRef<HTMLFormElement>(null);

  const toggleMode = () => {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      if (isLogin) {
        gsap.to(loginFormRef.current, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => setIsLogin(false),
        });
      } else {
        gsap.to(registerFormRef.current, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => setIsLogin(true),
        });
      }
    } else {
      if (isLogin) {
        gsap.to(loginFormRef.current, { 
          opacity: 0, 
          duration: 0.4,
          onComplete: () => {
            setIsLogin(false);
            gsap.fromTo(registerFormRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 });
          }
        });
      } else {
        gsap.to(registerFormRef.current, { 
          opacity: 0, 
          duration: 0.4,
          onComplete: () => {
            setIsLogin(true);
            gsap.fromTo(loginFormRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 });
          }
        });
      }
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const validation = loginSchema.safeParse(data);
    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    await login(data);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      fullName: formData.get("fullName") as string,
      phone: formData.get("phone") as string,
      userType: (formData.get("userType") as UserType) || "CITIZEN",
    };

    const validation = registerSchema.safeParse(data);
    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    await register({
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      phone: data.phone || undefined,
      userType: data.userType,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#132D46] via-[#0F2537] to-[#132D46] p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-16">
        
        {/* Register Form - Columna 1 cuando !isLogin */}
        <div 
          className="w-full max-w-md mx-auto md:mx-0 md:justify-self-end"
          style={{ 
            display: isLogin ? 'none' : 'block',
            gridColumn: isLogin ? 'auto' : '1'
          }}
        >
          <form
              ref={registerFormRef}
              onSubmit={handleRegisterSubmit}
              className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full"
            >
            <div className="text-center mb-6">
              <Image
                src="/images/logo_sin_fondo_oscuro.png"
                alt="LimaUrban"
                width={64}
                height={64}
                className="object-contain mx-auto mb-4 md:hidden"
              />
              <h2 className="text-2xl font-bold text-slate-800">Crear cuenta</h2>
              <p className="text-sm text-slate-600 mt-2">
                Regístrate para reportar incidentes urbanos
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">
                  Nombre completo
                </label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2" size={18} color="#00C48E" />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    placeholder="Juan Pérez"
                    className="pl-10 pr-4 py-2.5 block w-full rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00C48E] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="register-email" className="block text-sm font-medium text-slate-700 mb-1">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2" size={18} color="#00C48E" />
                  <input
                    id="register-email"
                    name="email"
                    type="email"
                    required
                    placeholder="tu@email.com"
                    className="pl-10 pr-4 py-2.5 block w-full rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00C48E] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                  Teléfono (opcional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2" size={18} color="#00C48E" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="987654321"
                    className="pl-10 pr-4 py-2.5 block w-full rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00C48E] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="userType" className="block text-sm font-medium text-slate-700 mb-1">
                  Tipo de usuario
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2" size={18} color="#00C48E" />
                  <select
                    id="userType"
                    name="userType"
                    required
                    defaultValue="CITIZEN"
                    className="pl-10 pr-4 py-2.5 block w-full rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00C48E] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="CITIZEN">Ciudadano</option>
                    <option value="MUNICIPALITY_STAFF">Personal Municipal</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="register-password" className="block text-sm font-medium text-slate-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2" size={18} color="#00C48E" />
                  <input
                    id="register-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="pl-10 pr-12 py-2.5 block w-full rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00C48E] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#00C48E] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2" size={18} color="#00C48E" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="pl-10 pr-12 py-2.5 block w-full rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00C48E] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#00C48E] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#00C48E] hover:bg-[#078F75] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creando cuenta..." : "Registrarse"}
              </button>

              <div className="text-center text-sm text-slate-600">
                ¿Ya tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-[#00C48E] hover:text-[#078F75] font-medium transition-colors"
                >
                  Inicia sesión
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Logo - Columna 1 cuando isLogin, Columna 2 cuando !isLogin */}
        <div
          ref={logoRef}
          className="flex flex-col items-center justify-center md:px-8"
          style={{
            gridColumn: isLogin ? '1' : '2'
          }}
        >
          <Image
            src="/images/logo_sin_fondo_claro.png"
            alt="LimaUrban"
            width={200}
            height={200}
            className="object-contain mb-4 w-32 md:w-48 lg:w-56"
          />
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold text-center">
            LimaUrban
          </h1>
        </div>

        {/* Login Form - Columna 2 cuando isLogin */}
        <div 
          className="w-full max-w-md mx-auto md:mx-0 md:justify-self-start"
          style={{ 
            display: isLogin ? 'block' : 'none',
            gridColumn: isLogin ? '2' : 'auto'
          }}
        >
          <form
              ref={loginFormRef}
              onSubmit={handleLoginSubmit}
              className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full"
            >
            <div className="text-center mb-6">
              <Image
                src="/images/logo_sin_fondo_oscuro.png"
                alt="LimaUrban"
                width={64}
                height={64}
                className="object-contain mx-auto mb-4 md:hidden"
              />
              <h2 className="text-2xl font-bold text-slate-800">Iniciar sesión</h2>
              <p className="text-sm text-slate-600 mt-2">
                Accede a tu cuenta de LimaUrban
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 mb-1">
                  Correo electrónico
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2" size={18} color="#00C48E" />
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    required
                    placeholder="tu@email.com"
                    className="pl-10 pr-4 py-2.5 block w-full rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00C48E] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2" size={18} color="#00C48E" />
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="pl-10 pr-12 py-2.5 block w-full rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00C48E] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#00C48E] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#00C48E] hover:bg-[#078F75] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Ingresando..." : "Iniciar sesión"}
              </button>

              <div className="text-center text-sm text-slate-600">
                ¿No tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-[#00C48E] hover:text-[#078F75] font-medium transition-colors"
                >
                  Regístrate
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
