"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { User, Lock, Eye, EyeOff, Mail, Phone, UserCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthAnimations } from "@/hooks/useAuthAnimations";
import { useFormValidation } from "@/hooks/useFormValidation";
import { PasswordRequirements } from "@/components/auth/PasswordRequirements";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Role } from "@/types";
import { loginSchema, registerSchema, passwordSchema } from "@/types/schemas";
import { toast } from "sonner";
import { z } from "zod";
import { gsap } from "gsap";

// Componentes de campos fuera del componente principal para evitar re-renders
interface LoginFormFieldsProps {
  isMobile: boolean;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  loginValidation: ReturnType<typeof useFormValidation>;
}

const LoginFormFields = ({ 
  isMobile, 
  showPassword, 
  setShowPassword, 
  loginValidation 
}: LoginFormFieldsProps) => (
  <>
    <Input
      id={isMobile ? "login-email-mobile" : "login-email-desktop"}
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
      id={isMobile ? "login-password-mobile" : "login-password-desktop"}
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
  </>
);

interface RegisterFormFieldsProps {
  isMobile: boolean;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (value: boolean) => void;
  registerPasswordValue: string;
  setRegisterPasswordValue: (value: string) => void;
  showPasswordRequirements: boolean;
  setShowPasswordRequirements: (value: boolean) => void;
  registerValidation: ReturnType<typeof useFormValidation>;
}

const RegisterFormFields = ({
  isMobile,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  registerPasswordValue,
  setRegisterPasswordValue,
  showPasswordRequirements,
  setShowPasswordRequirements,
  registerValidation
}: RegisterFormFieldsProps) => (
  <>
    <Input
      id={isMobile ? "fullName-mobile" : "fullName-desktop"}
      name="fullName"
      type="text"
      label="Nombre completo"
      placeholder="Juan Pérez"
      required
      icon={<UserCircle size={18} color="#00C48E" />}
    />

    <Input
      id={isMobile ? "register-email-mobile" : "register-email-desktop"}
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
      id={isMobile ? "phone-mobile" : "phone-desktop"}
      name="phone"
      type="tel"
      label="Teléfono (opcional)"
      placeholder="987654321"
      icon={<Phone size={18} color="#00C48E" />}
    />

    <Select
      id={isMobile ? "userType-mobile" : "userType-desktop"}
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
        id={isMobile ? "register-password-mobile" : "register-password-desktop"}
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
      id={isMobile ? "confirmPassword-mobile" : "confirmPassword-desktop"}
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
  </>
);

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

  // Limpiar estilos inline de GSAP al montar
  useEffect(() => {
    if (loginFormRef.current) {
      gsap.set(loginFormRef.current, { clearProps: "all" });
    }
    if (registerFormRef.current) {
      gsap.set(registerFormRef.current, { clearProps: "all" });
    }
  }, []);

  // Asegurar que el formulario visible sea completamente interactivo
  useEffect(() => {
    if (isLogin && loginFormRef.current) {
      gsap.set(loginFormRef.current, { 
        autoAlpha: 1, 
        visibility: "visible",
        pointerEvents: "auto",
        opacity: 1
      });
    }
    if (!isLogin && registerFormRef.current) {
      gsap.set(registerFormRef.current, { 
        autoAlpha: 1,
        visibility: "visible", 
        pointerEvents: "auto",
        opacity: 1
      });
    }
  }, [isLogin]);

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
      userType: (formData.get("userType") as Role) || "CITIZEN",
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
      role: data.userType,
    });
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#132D46] via-[#0F2537] to-[#132D46] p-4 sm:p-6">
      {/* Mobile Layout - Stack vertical */}
      <div className="lg:hidden w-full max-w-md mx-auto">
        {isLogin ? (
          <form
            ref={loginFormRef}
            onSubmit={handleLoginSubmit}
            className="bg-white rounded-xl shadow-2xl p-5 sm:p-6 w-full"
          >
            <div className="text-center mb-4 sm:mb-6">
              <Image
                src="/images/logo_sin_fondo_oscuro.png"
                alt="LimaUrban"
                width={56}
                height={56}
                className="object-contain mx-auto mb-3 w-14 sm:w-16"
                priority
              />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Iniciar sesión</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 sm:mt-2">
                Accede a tu cuenta de LimaUrban
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <LoginFormFields 
                isMobile={true} 
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                loginValidation={loginValidation}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 sm:py-3 px-4 bg-[#00C48E] hover:bg-[#078F75] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {loading ? "Ingresando..." : "Iniciar sesión"}
              </button>

              {/* Registro temporalmente deshabilitado */}
              {/* <div className="text-center text-xs sm:text-sm text-slate-600">
                ¿No tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-[#00C48E] hover:text-[#078F75] font-medium transition-colors"
                >
                  Regístrate
                </button>
              </div> */}
            </div>
          </form>
        ) : (
          <form
            ref={registerFormRef}
            onSubmit={handleRegisterSubmit}
            className="bg-white rounded-xl shadow-2xl p-5 sm:p-6 w-full"
          >
            <div className="text-center mb-4 sm:mb-6">
              <Image
                src="/images/logo_sin_fondo_oscuro.png"
                alt="LimaUrban"
                width={56}
                height={56}
                className="object-contain mx-auto mb-3 w-14 sm:w-16"
                priority
              />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Crear cuenta</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 sm:mt-2">
                Regístrate para reportar incidentes urbanos
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <RegisterFormFields 
                isMobile={true}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
                registerPasswordValue={registerPasswordValue}
                setRegisterPasswordValue={setRegisterPasswordValue}
                showPasswordRequirements={showPasswordRequirements}
                setShowPasswordRequirements={setShowPasswordRequirements}
                registerValidation={registerValidation}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 sm:py-3 px-4 bg-[#00C48E] hover:bg-[#078F75] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {loading ? "Creando cuenta..." : "Registrarse"}
              </button>

              <div className="text-center text-xs sm:text-sm text-slate-600">
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
        )}
      </div>

      {/* Desktop Layout - Grid de 2 columnas */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:max-w-6xl xl:max-w-7xl w-full">
        {/* Register Form - Columna izquierda cuando !isLogin */}
        {!isLogin && (
          <div className="w-full max-w-md justify-self-end">
            <form
              ref={registerFormRef}
              onSubmit={handleRegisterSubmit}
              className="bg-white rounded-2xl shadow-2xl p-8 w-full"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Crear cuenta</h2>
                <p className="text-sm text-slate-600 mt-2">
                  Regístrate para reportar incidentes urbanos
                </p>
              </div>

              <div className="space-y-4">
                <RegisterFormFields 
                  isMobile={false}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  showConfirmPassword={showConfirmPassword}
                  setShowConfirmPassword={setShowConfirmPassword}
                  registerPasswordValue={registerPasswordValue}
                  setRegisterPasswordValue={setRegisterPasswordValue}
                  showPasswordRequirements={showPasswordRequirements}
                  setShowPasswordRequirements={setShowPasswordRequirements}
                  registerValidation={registerValidation}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#00C48E] hover:bg-[#078F75] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        )}

        {/* Logo - Centro */}
        <div
          ref={logoRef}
          className="flex flex-col items-center justify-center px-8"
        >
          <Image
            src="/images/logo_sin_fondo_claro.png"
            alt="LimaUrban"
            width={200}
            height={200}
            className="object-contain mb-4 w-48 lg:w-56 xl:w-64"
            priority
          />
          <h1 className="text-white text-4xl lg:text-5xl font-bold text-center">
            LimaUrban
          </h1>
        </div>

        {/* Login Form - Columna derecha cuando isLogin */}
        {isLogin && (
          <div className="w-full max-w-md justify-self-start">
            <form
              ref={loginFormRef}
              onSubmit={handleLoginSubmit}
              className="bg-white rounded-2xl shadow-2xl p-8 w-full"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Iniciar sesión</h2>
                <p className="text-sm text-slate-600 mt-2">
                  Accede a tu cuenta de LimaUrban
                </p>
              </div>

              <div className="space-y-4">
                <LoginFormFields 
                  isMobile={false}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  loginValidation={loginValidation}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#00C48E] hover:bg-[#078F75] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Ingresando..." : "Iniciar sesión"}
                </button>

                {/* Registro temporalmente deshabilitado */}
                {/* <div className="text-center text-sm text-slate-600">
                  ¿No tienes cuenta?{" "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-[#00C48E] hover:text-[#078F75] font-medium transition-colors"
                  >
                    Regístrate
                  </button>
                </div> */}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
