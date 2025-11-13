import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Incident } from '@/types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

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

      // Fetch incident with basic relations
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
          )
        `)
        .eq('incident_id', incidentId)
        .single();

      if (queryError) throw queryError;

      // Fetch reported_by user separately
      let reportedByUser = null;
      if (data?.reported_by) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, full_name, phone, role_id, role:roles!role_id(code)')
          .eq('id', data.reported_by)
          .single();
        
        if (!userError && userData) {
          reportedByUser = userData;
        }
      }

      // Fetch assigned_to user separately
      let assignedToUser = null;
      if (data?.assigned_to) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, full_name, phone, role_id, role:roles!role_id(code)')
          .eq('id', data.assigned_to)
          .single();
        
        if (!userError && userData) {
          assignedToUser = userData;
        }
      }

      // Fetch comments with author info
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select(`
          comment_id,
          incident_id,
          author_id,
          content,
          is_internal,
          created_at,
          updated_at,
          users (
            id,
            full_name,
            phone,
            role_id,
            role:roles!role_id(code)
          )
        `)
        .eq('incident_id', incidentId)
        .order('created_at', { ascending: true });

      if (commentsError) {
        console.error('Error fetching comments:', commentsError);
      }

      setIncident({
        ...data,
        reported_by_user: reportedByUser,
        assigned_to_user: assignedToUser,
        comments: commentsData || []
      });
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
