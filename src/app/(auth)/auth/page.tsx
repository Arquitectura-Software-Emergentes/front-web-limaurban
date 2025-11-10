"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { User, Lock, Eye, EyeOff, Mail, Phone, UserCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthAnimations } from "@/hooks/useAuthAnimations";
import { useFormValidation } from "@/hooks/useFormValidation";
import { PasswordRequirements } from "@/components/auth/PasswordRequirements";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { UserType } from "@/types";
import { loginSchema, registerSchema, passwordSchema } from "@/types/schemas";
import { toast } from "sonner";
import { z } from "zod";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerPasswordValue, setRegisterPasswordValue] = useState("");
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const { login, register, loading } = useAuth();

  const loginValidation = useFormValidation();
  const registerValidation = useFormValidation();

  const logoRef = useRef<HTMLDivElement>(null);
  const loginFormRef = useRef<HTMLFormElement>(null);
  const registerFormRef = useRef<HTMLFormElement>(null);

  const handleModeChange = () => {
    setShowPassword(false);
    setShowConfirmPassword(false);
    setRegisterPasswordValue("");
    setShowPasswordRequirements(false);
    loginValidation.clearErrors();
    registerValidation.clearErrors();
  };

  const { toggleMode } = useAuthAnimations({
    logoRef,
    loginFormRef,
    registerFormRef,
    isLogin,
    setIsLogin,
    onModeChange: handleModeChange,
  });

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
              <Input
                id="fullName"
                name="fullName"
                type="text"
                label="Nombre completo"
                placeholder="Juan Pérez"
                required
                icon={<UserCircle size={18} color="#00C48E" />}
              />

              <Input
                id="register-email"
                name="email"
                type="email"
                label="Correo electrónico"
                placeholder="tu@email.com"
                required
                icon={<Mail size={18} color="#00C48E" />}
                error={registerValidation.getError("email")}
                showError={!!registerValidation.shouldShowError("email")}
                onChange={(e) =>
                  registerValidation.validateField(
                    "email",
                    e.target.value,
                    z.string().email("Ingresa un correo electrónico válido")
                  )
                }
                onBlur={() => registerValidation.handleBlur("email")}
              />

              <Input
                id="phone"
                name="phone"
                type="tel"
                label="Teléfono (opcional)"
                placeholder="987654321"
                icon={<Phone size={18} color="#00C48E" />}
              />

              <Select
                id="userType"
                name="userType"
                label="Tipo de usuario"
                required
                defaultValue="CITIZEN"
                icon={<User size={18} color="#00C48E" />}
                options={[
                  { value: "CITIZEN", label: "Ciudadano" },
                  { value: "MUNICIPALITY_STAFF", label: "Personal Municipal" }
                ]}
              />

              <div className="relative">
                <Input
                  id="register-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  label="Contraseña"
                  placeholder="••••••••"
                  required
                  icon={<Lock size={18} color="#00C48E" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-[#00C48E] transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                  error={registerValidation.getError("password")}
                  showError={!!registerValidation.shouldShowError("password") && !showPasswordRequirements}
                  onChange={(e) => {
                    setRegisterPasswordValue(e.target.value);
                    registerValidation.validateField("password", e.target.value, passwordSchema);
                  }}
                  onFocus={() => setShowPasswordRequirements(true)}
                  onBlur={() => {
                    registerValidation.handleBlur("password");
                    setShowPasswordRequirements(false);
                  }}
                />
                <PasswordRequirements 
                  password={registerPasswordValue} 
                  show={showPasswordRequirements} 
                />
              </div>

              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                label="Confirmar contraseña"
                placeholder="••••••••"
                required
                icon={<Lock size={18} color="#00C48E" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-slate-400 hover:text-[#00C48E] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                error={registerValidation.getError("confirmPassword")}
                showError={!!registerValidation.shouldShowError("confirmPassword")}
                onChange={(e) => {
                  if (e.target.value && registerPasswordValue) {
                    if (e.target.value !== registerPasswordValue) {
                      registerValidation.setError("confirmPassword", "Las contraseñas no coinciden");
                    } else {
                      registerValidation.clearFieldError("confirmPassword");
                    }
                  }
                }}
                onBlur={() => registerValidation.handleBlur("confirmPassword")}
              />

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
              <Input
                id="login-email"
                name="email"
                type="email"
                label="Correo electrónico"
                placeholder="tu@email.com"
                required
                icon={<User size={18} color="#00C48E" />}
                error={loginValidation.getError("email")}
                showError={!!loginValidation.shouldShowError("email")}
                onChange={(e) =>
                  loginValidation.validateField(
                    "email",
                    e.target.value,
                    z.string().email("Ingresa un correo electrónico válido")
                  )
                }
                onBlur={() => loginValidation.handleBlur("email")}
              />

              <Input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                label="Contraseña"
                placeholder="••••••••"
                required
                icon={<Lock size={18} color="#00C48E" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-[#00C48E] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#00C48E] hover:bg-[#078F75] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Ingresando..." : "Iniciar sesión"}
              </button>

              <div className="text-center text-sm text-slate-600">
                ¿No tienes cuenta?{" "}
                {/* <button
                  type="button"
                  onClick={toggleMode}
                  className="text-[#00C48E] hover:text-[#078F75] font-medium transition-colors"
                >
                  Regístrate
                </button> */}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
