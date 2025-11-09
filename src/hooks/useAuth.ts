import { useState } from 'react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { UserType, UserInsert } from '@/types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  userType: UserType;
}

interface AuthError {
  message: string;
}

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async ({ email, password }: LoginCredentials) => {
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      toast.success('Inicio de sesión exitoso');
      router.push('/dashboard');
      return { success: true, user: data.user };
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message);
      toast.error(authError.message);
      return { success: false, error: authError.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ email, password, fullName, phone, userType }: RegisterData) => {
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();

      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('No se pudo crear el usuario');

      const userInsert: UserInsert = {
        id: authData.user.id,
        full_name: fullName,
        phone: phone || null,
        user_type: userType,
        is_active: true,
      };

      const { error: insertError } = await supabase
        .from('users')
        .insert(userInsert);

      if (insertError) {
        await supabase.auth.signOut();
        throw new Error(`Error al crear el perfil: ${insertError.message}`);
      }

      toast.success('Cuenta creada exitosamente. Redirigiendo al login...');
      setTimeout(() => router.push('/auth'), 1500);
      return { success: true, user: authData.user };
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message);
      toast.error(authError.message);
      return { success: false, error: authError.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      toast.success('Sesión cerrada correctamente');
      router.push('/auth');
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message);
      toast.error('Error al cerrar sesión');
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
