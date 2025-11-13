import { useState } from 'react';
import { toast } from 'sonner';
import { login as loginAction, register as registerAction, logout as logoutAction } from '@/actions/auth.actions';
import { RoleType } from '@/types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: RoleType;
}

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    setError(null);
    setLoading(true);

    try {
      const result = await loginAction(credentials);
      
      if (!result.success) {
        const errorMsg = result.error || 'Error al iniciar sesión';
        setError(errorMsg);
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }

      toast.success('Inicio de sesión exitoso');
      
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get('redirectTo') || '/dashboard';
      window.location.href = redirectTo;
      
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setError(null);
    setLoading(true);

    try {
      const result = await registerAction(data);

      if (!result.success) {
        const errorMsg = result.error || 'Error al crear cuenta';
        setError(errorMsg);
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }

      toast.success(result.message || 'Cuenta creada exitosamente');
      
      // Redirigir a la página de éxito después del registro
      window.location.href = '/auth/signup-success';
      
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const result = await logoutAction();
      
      if (!result.success) {
        const errorMsg = result.error || 'Error al cerrar sesión';
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }
      
      toast.success('Sesión cerrada correctamente');
      window.location.href = '/auth';
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cerrar sesión';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    register,
    logout,
    loading,
    error,
  };
}
