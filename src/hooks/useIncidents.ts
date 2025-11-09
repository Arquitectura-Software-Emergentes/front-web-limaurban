import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Incident } from '@/types';
import { toast } from 'sonner';

interface UseIncidentsOptions {
  districtCode?: string;
  status?: string;
  category?: string;
  priority?: string;
  limit?: number;
}

interface UseIncidentsReturn {
  incidents: Incident[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  total: number;
}

export function useIncidents(options: UseIncidentsOptions = {}): UseIncidentsReturn {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchIncidents = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      let query = supabase
        .from('incidents')
        .select(`
          *,
          districts (
            district_code,
            district_name
          ),
          incident_categories (
            category_code,
            category_name
          ),
          users!reported_by (
            id,
            full_name,
            user_type
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      if (options.districtCode) {
        query = query.eq('district_code', options.districtCode);
      }

      if (options.status) {
        query = query.eq('status', options.status);
      }

      if (options.category) {
        query = query.eq('category_code', options.category);
      }

      if (options.priority) {
        query = query.eq('priority', options.priority);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error: queryError, count } = await query;

      if (queryError) throw queryError;

      setIncidents(data || []);
      setTotal(count || 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar incidentes';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.districtCode, options.status, options.category, options.priority, options.limit]);

  return {
    incidents,
    loading,
    error,
    refetch: fetchIncidents,
    total,
  };
}
