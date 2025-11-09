import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { District } from '@/types';
import { toast } from 'sonner';

interface UseDistrictsReturn {
  districts: District[];
  loading: boolean;
  error: string | null;
}

export function useDistricts(): UseDistrictsReturn {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDistricts() {
      try {
        const supabase = createClient();

        const { data, error: queryError } = await supabase
          .from('districts')
          .select('*')
          .order('district_name');

        if (queryError) throw queryError;

        setDistricts(data || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar distritos';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchDistricts();
  }, []);

  return {
    districts,
    loading,
    error,
  };
}
