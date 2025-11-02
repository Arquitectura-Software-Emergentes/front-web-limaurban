"use client";

import React from "react";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="w-full max-w-6xl mx-auto p-8">
      <div className="bg-transparent rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-stretch gap-8">
          {/* Left: logo y título */}
          <div className="md:flex-1 flex flex-col items-center justify-center px-6 py-12">
            <img
              src="\images\logo_sin_fondo_claro.png"
              alt="LimaUrban"
              className="h-[452px] w-auto object-contain mb-6"
            />
            <h1 className="text-8xl font-medium text-center text-white">LimaUrban</h1>
          </div>

          {/* Right: formulario */}
          <div className="md:w-[420px] w-full flex items-center justify-center px-6 py-12">
            <div className="w-full bg-white rounded-[15px] shadow-sm text-slate-900">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
