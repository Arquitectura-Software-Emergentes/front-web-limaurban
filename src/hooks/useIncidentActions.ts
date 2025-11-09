import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

type IncidentStatus = 'pending' | 'in_review' | 'in_progress' | 'resolved' | 'closed' | 'rejected';

interface UseIncidentActionsReturn {
  updateStatus: (incidentId: string, status: IncidentStatus) => Promise<boolean>;
  loading: boolean;
}

export function useIncidentActions(): UseIncidentActionsReturn {
  const [loading, setLoading] = useState(false);

  const updateStatus = async (incidentId: string, status: IncidentStatus): Promise<boolean> => {
    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('incidents')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', incidentId);

      if (error) throw error;

      toast.success('Estado actualizado correctamente');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar estado';
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateStatus,
    loading,
  };
}
