'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client-browser';
import { User } from '@/types';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface UseUserReturn {
  user: SupabaseUser | null;
  profile: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (role: 'CITIZEN' | 'MUNICIPALITY_STAFF') => boolean;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError) throw authError;
      
      if (!authUser) {
        setUser(null);
        setProfile(null);
        return;
      }

      setUser(authUser);

      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select(`
          id,
          full_name,
          phone,
          avatar_url,
          role_id,
          metadata,
          is_active,
          created_at,
          updated_at,
          role:roles!role_id (
            code,
            description
          )
        `)
        .eq('id', authUser.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw profileError;
      }

      if (!profileData) {
        throw new Error('No profile data found');
      }

      const userProfile: User = {
        ...profileData,
        role: Array.isArray(profileData.role) ? profileData.role[0] : profileData.role
      };

      setProfile(userProfile);
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar usuario');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      if (session?.user) {
        setUser(session.user);
        fetchUser();
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const hasRole = (role: 'CITIZEN' | 'MUNICIPALITY_STAFF'): boolean => {
    if (!profile || !profile.role) return false;
    return profile.role.code === role;
  };

  return {
    user,
    profile,
    loading,
    error,
    refetch: fetchUser,
    isAuthenticated: !!user,
    hasRole,
  };
}
