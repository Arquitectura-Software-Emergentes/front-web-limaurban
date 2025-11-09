import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface Comment {
  incident_id: string;
  comment_text: string;
}

interface UseCommentsReturn {
  createComment: (data: Comment) => Promise<boolean>;
  loading: boolean;
}

export function useComments(): UseCommentsReturn {
  const [loading, setLoading] = useState(false);

  const createComment = async (data: Comment): Promise<boolean> => {
    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('incident_comments')
        .insert({
          incident_id: data.incident_id,
          comment_text: data.comment_text,
          // user_id se obtiene automáticamente del JWT vía RLS
        });

      if (error) throw error;

      toast.success('Comentario agregado correctamente');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear comentario';
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createComment,
    loading,
  };
}
