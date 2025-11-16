import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { IncidentFull } from '@/types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface UseIncidentReturn {
  incident: IncidentFull | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useIncident(incidentId: string | null): UseIncidentReturn {
  const [incident, setIncident] = useState<IncidentFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchIncident = async () => {
    if (!incidentId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // Use v_incidents_full view to get all data including YOLO results
      const { data, error: queryError } = await supabase
        .from('v_incidents_full')
        .select('*')
        .eq('incident_id', incidentId)
        .single();

      console.log('🔍 useIncident - Raw data from v_incidents_full:', {
        incident_id: incidentId,
        hasUrlResultado: data?.url_resultado !== undefined,
        url_resultado: data?.url_resultado,
        fullData: data,
      });

      if (queryError) throw queryError;

      // Data already includes all fields from v_incidents_full
      // Comments will be managed separately in CommentsSection
      setIncident(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar incidente';
      setError(errorMessage);
      
      // Check if it's an auth error
      if (errorMessage.includes('JWT') || errorMessage.includes('session') || errorMessage.includes('401')) {
        toast.error('Tu sesión ha expirado. Redirigiendo...');
        setTimeout(() => router.push('/auth'), 2000);
      } else {
        toast.error(errorMessage);
      }
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
