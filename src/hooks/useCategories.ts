import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { IncidentCategory } from '@/types';
import { toast } from 'sonner';

interface UseCategoriesReturn {
  categories: IncidentCategory[];
  loading: boolean;
  error: string | null;
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<IncidentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const supabase = createClient();

        const { data, error: queryError } = await supabase
          .from('incident_categories')
          .select('*')
          .order('category_name');

        if (queryError) throw queryError;

        setCategories(data || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar categorías';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
  };
}
