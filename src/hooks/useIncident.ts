import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Incident } from '@/types';
import { toast } from 'sonner';

interface UseIncidentReturn {
  incident: Incident | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useIncident(incidentId: string | null): UseIncidentReturn {
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncident = async () => {
    if (!incidentId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { data, error: queryError } = await supabase
        .from('incidents')
        .select(`
          *,
          districts (
            district_code,
            district_name,
            population,
            area_km2
          ),
          incident_categories (
            category_id,
            code,
            name,
            description,
            icon_url
          ),
          comments (
            comment_id,
            author_id,
            content,
            is_internal,
            created_at,
            updated_at
          )
        `)
        .eq('incident_id', incidentId)
        .single();

      if (queryError) throw queryError;

      setIncident(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar incidente';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncident();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incidentId]);

  return {
    incident,
    loading,
    error,
    refetch: fetchIncident,
  };
}
