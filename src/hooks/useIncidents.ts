import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { IncidentFull } from '@/types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface UseIncidentsOptions {
  districtCode?: string;
  status?: string;
  category?: string;
  priority?: string;
  limit?: number;
}

interface UseIncidentsReturn {
  incidents: IncidentFull[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  total: number;
}

export function useIncidents(options: UseIncidentsOptions = {}): UseIncidentsReturn {
  const [incidents, setIncidents] = useState<IncidentFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  const fetchIncidents = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      let query = supabase
        .from('v_incidents_full')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (options.districtCode) {
        query = query.eq('district_code', options.districtCode);
      }

      if (options.status) {
        query = query.eq('status', options.status);
      }

      if (options.category) {
        query = query.eq('category_id', options.category);
      }

      if (options.priority) {
        query = query.eq('priority', options.priority);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error: queryError, count } = await query;

      console.log('🔍 useIncidents - Raw Supabase response:', {
        firstIncident: data?.[0],
        hasUrlResultado: data?.[0]?.url_resultado !== undefined,
        urlResultadoValue: data?.[0]?.url_resultado,
      });

      if (queryError) throw queryError;

      const safeData = (data || []).map(incident => ({
        ...incident,
        reporter_name: incident.reporter_name ?? 'Usuario Desconocido',
        assignee_name: incident.assignee_name ?? null,
        updated_by_name: incident.updated_by_name ?? null,
        category_name: incident.category_name ?? 'Sin categoría',
        category_code: incident.category_code ?? 'OTHER',
        district_name: incident.district_name ?? 'Sin distrito',
        detection_id: incident.detection_id ?? null,
        yolo_confidence: incident.yolo_confidence ?? null,
        bounding_box: incident.bounding_box ?? null,
        model_version: incident.model_version ?? null,
        num_detecciones: incident.num_detecciones ?? null,
        url_resultado: incident.url_resultado ?? null,
        yolo_detected_at: incident.yolo_detected_at ?? null,
        comment_count: incident.comment_count ?? 0,
        attachment_count: incident.attachment_count ?? 0,
      }));

      setIncidents(safeData);
      setTotal(count || 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar incidentes';
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
