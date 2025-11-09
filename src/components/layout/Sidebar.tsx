"use client";

import React from 'react';
import { LayoutDashboard, Map, Building2, LogOut } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth');
  };

  return (
    <div className="fixed top-0 left-0 w-64 h-screen border-r border-[#345473] bg-gradient-to-b from-[#132D46] via-[#078F75] to-[#00C48E] flex flex-col justify-between p-4 z-10">
      <div>
        <div className="mb-8 px-4 flex items-end">
          <Image
            src="/images/logo_sin_fondo_claro.png"
            alt="LimaUrban"
            width={48}
            height={48}
            className="h-12 w-auto"
          />
          <h1 className="text-white text-xl font-medium ml-2">LimaUrban</h1>
        </div>
        <nav className="flex flex-col space-y-4">
          <Link 
            href="/dashboard"
            className="flex items-center px-4 py-2 text-[#D9D9D9] hover:bg-[#034A36] rounded-[7px] transition-colors"
          >
            <LayoutDashboard size={20} className="text-[#00C48E] mr-3" />
            <span>Dashboard</span>
          </Link>
          <Link 
            href="/maps"
            className="flex items-center px-4 py-2 text-[#D9D9D9] hover:bg-[#034A36] rounded-[7px] transition-colors"
          >
            <Map size={20} className="text-[#00C48E] mr-3" />
            <span>Mapas</span>
          </Link>
          <Link 
            href="/municipality"
            className="flex items-center px-4 py-2 text-[#D9D9D9] hover:bg-[#034A36] rounded-[7px] transition-colors"
          >
            <Building2 size={20} className="text-[#00C48E] mr-3" />
            <span>Municipalidad</span>
          </Link>
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center justify-center space-x-2 px-6 py-2 text-white bg-[#0E3D41] hover:bg-opacity-90 rounded-[100px] transition-colors mx-auto shadow-[0_0_10px_#00FFCD]"
      >
        <div className="flex items-center justify-center">
          <LogOut size={20} className="text-white" />
          <span className="ml-2">Cerrar Sesión</span>
        </div>
      </button>
    </div>
  );
}
