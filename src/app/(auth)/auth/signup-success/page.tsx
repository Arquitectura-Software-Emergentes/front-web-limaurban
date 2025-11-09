export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#00C48E] to-[#00A076] p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg
              className="h-8 w-8 text-green-600"
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

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Registro Exitoso
          </h1>

          <p className="text-gray-600 mb-6">
            Hemos enviado un correo de confirmación a tu email.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              Por favor, revisa tu bandeja de entrada (y spam) y haz clic en el
              enlace de confirmación para activar tu cuenta.
            </p>
          </div>

          <a
            href="/auth"
            className="inline-flex items-center justify-center w-full px-4 py-2 bg-[#00C48E] text-white rounded-lg hover:bg-[#00A076] transition-colors"
          >
            Volver al inicio de sesión
          </a>
        </div>
      </div>
    </div>
  );
}
