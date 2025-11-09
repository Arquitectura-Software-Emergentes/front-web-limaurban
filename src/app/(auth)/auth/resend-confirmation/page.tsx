/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResendConfirmationPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: `${baseUrl}/auth/confirm?next=/dashboard`,
        },
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({
          type: "success",
          text: "Correo de confirmación reenviado. Revisa tu bandeja de entrada.",
        });
        setEmail("");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error al reenviar el correo. Intenta nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#132D46] via-[#0F2537] to-[#132D46] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center">
            <Image
              src="/images/logo_sin_fondo_oscuro.png"
              alt="LimaUrban"
              width={80}
              height={80}
              className="object-contain mx-auto mb-6"
            />

            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
              <svg
                className="h-8 w-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Reenviar Confirmación
            </h1>

            <p className="text-slate-600 mb-6">
              Ingresa tu correo electrónico para recibir un nuevo enlace de confirmación.
            </p>

            <form onSubmit={handleResend} className="space-y-4">
              <div className="text-left">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00C48E] focus:border-transparent"
                />
              </div>

              {message && (
                <div
                  className={`p-4 rounded-lg ${
                    message.type === "success"
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <p
                    className={`text-sm ${
                      message.type === "success" ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {message.text}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-[#00C48E] text-white font-medium rounded-lg hover:bg-[#078F75] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Enviando..." : "Reenviar Correo"}
              </button>

              <a
                href="/auth"
                className="block text-center text-sm text-slate-600 hover:text-[#00C48E] transition-colors"
              >
                Volver al inicio de sesión
              </a>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
