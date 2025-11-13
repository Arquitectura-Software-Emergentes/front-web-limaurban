'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from './useUser';
import { toast } from 'sonner';

interface UseAuthGuardOptions {
  requireAuth?: boolean;
  requiredRole?: 'CITIZEN' | 'MUNICIPALITY_STAFF';
  redirectTo?: string;
}

export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const {
    requireAuth = true,
    requiredRole,
    redirectTo = '/auth',
  } = options;

  const { user, profile, loading, hasRole } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (requireAuth && !user) {
      toast.error('Debes iniciar sesión para acceder a esta página');
      router.push(`${redirectTo}?redirectTo=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (requiredRole && !hasRole(requiredRole)) {
      toast.error('No tienes permisos para acceder a esta página');
      router.push('/dashboard');
      return;
    }
  }, [user, profile, loading, requireAuth, requiredRole, redirectTo, hasRole, router]);

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    hasRole,
  };
}
