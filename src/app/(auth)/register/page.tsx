import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#132D46] to-[#078F75]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-center text-[#132D46] mb-2">
              Crear cuenta
            </h2>
            <p className="text-center text-slate-600 text-sm mb-6">
              Regístrate para reportar incidentes urbanos
            </p>
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
