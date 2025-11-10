'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function SessionHandler() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        router.push('/auth');
      }

      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refrescado exitosamente');
      }

      if (event === 'USER_UPDATED') {
        console.log('Usuario actualizado');
      }

      if (!session) {
        router.push('/auth');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return null;
}
