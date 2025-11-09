import Image from "next/image";
import ErrorDisplay from "@/components/auth/ErrorDisplay";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; error_description?: string; error_code?: string }>;
}) {
  const params = await searchParams;
  
  // Priorizar error_description si existe, sino usar error, sino mensaje por defecto
  const rawError = params.error_description || params.error;
  const errorMessage = rawError 
    ? decodeURIComponent(rawError) 
    : "Ocurrió un error inesperado";
  
  // Verificar si el error es por token expirado
  const isExpiredToken = params.error_code === "otp_expired" || 
                         errorMessage.toLowerCase().includes("expired") ||
                         errorMessage.toLowerCase().includes("expirado");

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

                {/* Error Icon */}
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  <svg
                    className="h-8 w-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>

                <h1 className="text-2xl font-bold text-slate-800 mb-2">
                  Error de Autenticación
                </h1>

                <p className="text-slate-600 mb-6">
                  Lo sentimos, algo salió mal durante el proceso de autenticación.
                </p>

                <ErrorDisplay serverError={errorMessage} />

                <div className="space-y-3">
                  {isExpiredToken && (
                    <a
                      href="/auth/resend-confirmation"
                      className="inline-flex items-center justify-center w-full px-4 py-3 bg-[#00C48E] text-white font-medium rounded-lg hover:bg-[#078F75] transition-colors"
                    >
                      Reenviar correo de confirmación
                    </a>
                  )}
                  
                  <a
                    href="/auth"
                    className={`inline-flex items-center justify-center w-full px-4 py-3 font-medium rounded-lg transition-colors ${
                      isExpiredToken
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        : "bg-[#00C48E] text-white hover:bg-[#078F75]"
                    }`}
                  >
                    Volver al inicio de sesión
                  </a>

                  <p className="text-sm text-slate-500">
                    Si el problema persiste, contacta al soporte técnico.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
  );
}
