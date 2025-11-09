import Image from "next/image";

export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#132D46] via-[#0F2537] to-[#132D46] p-4">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="text-center">
                {/* Logo */}
                <Image
                  src="/images/logo_sin_fondo_oscuro.png"
                  alt="LimaUrban"
                  width={80}
                  height={80}
                  className="object-contain mx-auto mb-6"
                />

                {/* Success Icon */}
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <svg
                    className="h-8 w-8 text-[#00C48E]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <h1 className="text-2xl font-bold text-slate-800 mb-2">
                  Registro Exitoso
                </h1>

                <p className="text-slate-600 mb-6">
                  Hemos enviado un correo de confirmación a tu email.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                  <p className="text-sm text-blue-800">
                    Por favor, revisa tu bandeja de entrada (y spam) y haz clic en el
                    enlace de confirmación para activar tu cuenta.
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    El enlace expira en 24 horas.
                  </p>
                </div>

                <div className="space-y-3">
                  <a
                    href="/auth"
                    className="inline-flex items-center justify-center w-full px-4 py-3 bg-[#00C48E] text-white font-medium rounded-lg hover:bg-[#078F75] transition-colors"
                  >
                    Volver al inicio de sesión
                  </a>

                  <a
                    href="/auth/resend-confirmation"
                    className="block text-center text-sm text-slate-600 hover:text-[#00C48E] transition-colors"
                  >
                    ¿No recibiste el correo? Reenviar
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
  );
}
