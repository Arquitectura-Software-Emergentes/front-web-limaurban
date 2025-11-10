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

      // Fetch reported_by user
      let reportedByUser = null;
      if (data.reported_by) {
        const { data: userData } = await supabase
          .from('users')
          .select('id, full_name, email, user_type')
          .eq('id', data.reported_by)
          .single();
        reportedByUser = userData;
      }

      // Fetch assigned_to user
      let assignedToUser = null;
      if (data.assigned_to) {
        const { data: userData } = await supabase
          .from('users')
          .select('id, full_name, email, user_type')
          .eq('id', data.assigned_to)
          .single();
        assignedToUser = userData;
      }

      // Fetch comments
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
            email,
            user_type
          )
        `)
        .eq('incident_id', incidentId)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;

      setIncident({
        ...data,
        reported_by_user: reportedByUser,
        assigned_to_user: assignedToUser,
        comments: commentsData || []
      });
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
