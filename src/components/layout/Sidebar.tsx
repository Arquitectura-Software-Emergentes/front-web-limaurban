"use client";

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Map, Building2, LogOut, Menu, X, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const { logout, loading } = useAuth();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen]);

  const handleLogout = async () => {
    await logout();
  };

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/maps', icon: Map, label: 'Mapas' },
    { href: '/municipality', icon: Building2, label: 'Municipalidad' },
  ];

  return (
    <>
      {/* Mobile: Hamburger Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#132D46] border border-[#345473] rounded-lg text-[#00C48E] hover:bg-[#0E3D41] transition-colors"
        aria-label="Abrir menú"
      >
        <Menu size={24} />
      </button>

      {/* Mobile: Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen border-r border-[#345473] 
          bg-gradient-to-b from-[#132D46] via-[#078F75] to-[#00C48E] 
          flex flex-col justify-between p-4 z-50 transition-all duration-300
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isDesktopCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64
        `}
      >
        <div>
          {/* Header */}
          <div className={`mb-8 flex items-end ${isDesktopCollapsed ? 'justify-center' : 'justify-between px-4'}`}>
            <div className="flex items-end overflow-hidden">
              <Image
                src="/images/logo_sin_fondo_claro.png"
                alt="LimaUrban"
                width={48}
                height={48}
                className="h-12 w-auto flex-shrink-0"
              />
              {!isDesktopCollapsed && (
                <h1 className="text-white text-xl font-medium ml-2 whitespace-nowrap">
                  LimaUrban
                </h1>
              )}
            </div>

            {/* Desktop: Collapse Button */}
            {!isDesktopCollapsed && (
              <button
                onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
                className="hidden lg:block p-1.5 hover:bg-[#034A36] rounded-md transition-colors flex-shrink-0"
                aria-label="Colapsar sidebar"
              >
                <ChevronLeft size={20} className="text-[#00C48E]" />
              </button>
            )}

            {/* Mobile: Close Button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 hover:bg-[#034A36] rounded-md transition-colors"
              aria-label="Cerrar menú"
            >
              <X size={20} className="text-[#00C48E]" />
            </button>
          </div>

          {/* Desktop: Expand Button (when collapsed) */}
          {isDesktopCollapsed && (
            <div className="hidden lg:flex justify-center mb-6">
              <button
                onClick={() => setIsDesktopCollapsed(false)}
                className="p-2 hover:bg-[#034A36] hover:rounded-md rounded-md transition-colors"
                aria-label="Expandir sidebar"
              >
                <ChevronLeft size={20} className="text-[#00C48E] rotate-180" />
              </button>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center px-4 py-2 rounded-[7px] transition-colors
                    ${isActive ? 'bg-[#034A36] text-white' : 'text-[#D9D9D9] hover:bg-[#034A36]'}
                    ${isDesktopCollapsed ? 'lg:justify-center' : ''}
                  `}
                  title={isDesktopCollapsed ? item.label : ''}
                >
                  <Icon size={20} className="text-[#00C48E] flex-shrink-0" />
                  {!isDesktopCollapsed && <span className="ml-3">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={loading}
          className={`
            flex items-center justify-center px-6 py-2 text-white 
            bg-[#0E3D41] hover:bg-opacity-90 rounded-[100px] transition-colors 
            shadow-[0_0_10px_#00FFCD] disabled:opacity-50
            ${isDesktopCollapsed ? 'lg:px-3' : ''}
          `}
          title={isDesktopCollapsed ? 'Cerrar Sesión' : ''}
        >
          <LogOut size={20} className="text-white flex-shrink-0" />
          {!isDesktopCollapsed && (
            <span className="ml-2 whitespace-nowrap">
              {loading ? 'Cerrando...' : 'Cerrar Sesión'}
            </span>
          )}
        </button>
      </aside>

      {/* Spacer para desktop */}
      <div
        className={`
          hidden lg:block transition-all duration-300
          ${isDesktopCollapsed ? 'lg:w-20' : 'lg:w-64'}
        `}
      />
    </>
  );
}
