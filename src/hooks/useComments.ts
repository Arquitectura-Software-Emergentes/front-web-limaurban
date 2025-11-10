import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface CommentInput {
  incident_id: string;
  content: string;
}

interface UseCommentsReturn {
  createComment: (data: CommentInput) => Promise<boolean>;
  loading: boolean;
}

export function useComments(): UseCommentsReturn {
  const [loading, setLoading] = useState(false);

  const createComment = async (data: CommentInput): Promise<boolean> => {
    setLoading(true);

    try {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const { error } = await supabase
        .from('comments')
        .insert({
          incident_id: data.incident_id,
          author_id: user.id,
          content: data.content,
          is_internal: false,
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
