export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const errorMessage = params.error || "Ocurrió un error inesperado";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-red-700 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center">
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

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Error de Autenticación
          </h1>

          <p className="text-gray-600 mb-6">
            Lo sentimos, algo salió mal durante el proceso de autenticación.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800 font-mono break-words">
              {errorMessage}
            </p>
          </div>

          <div className="space-y-3">
            <a
              href="/auth"
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-[#00C48E] text-white rounded-lg hover:bg-[#00A076] transition-colors"
            >
              Volver al inicio de sesión
            </a>

            <p className="text-sm text-gray-500">
              Si el problema persiste, contacta al soporte técnico.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
