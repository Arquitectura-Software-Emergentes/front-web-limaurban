"use client";

import React, { useState } from 'react';
import { Mail, Eye, EyeOff, Lock } from 'lucide-react';

export default function MunicipalityPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="max-w-[1200px] mx-auto p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Información de la Municipalidad</h1>
      
      <div className="bg-[#1A1E29] border-2 border-[#345473] rounded-[7px] p-6">
        <div className="space-y-4 max-w-md">
          <div className="relative">
            <label className="block text-sm font-medium text-[#D9D9D9] mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2" size={18} color="#00C48E" />
              <input
                type="email"
                className="pl-10 py-2 w-full rounded-[7px] border border-[#00C48E] bg-transparent text-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-[#00C48E]"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-[#D9D9D9] mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2" size={18} color="#00C48E" />
              <input
                type={showPassword ? "text" : "password"}
                className="pl-10 pr-10 py-2 w-full rounded-[7px] border border-[#00C48E] bg-transparent text-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-[#00C48E]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00C48E] hover:text-[#00A070] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
