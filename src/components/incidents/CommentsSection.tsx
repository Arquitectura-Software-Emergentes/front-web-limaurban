/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useComments } from '@/hooks/useComments';
import { Comment } from '@/types';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

interface CommentsSectionProps {
  incidentId: string;
}

export default function CommentsSection({ incidentId }: CommentsSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [localComments, setLocalComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const { createComment, loading } = useComments();

  // Fetch comments on mount
  useEffect(() => {
    const fetchComments = async () => {
      const supabase = createClient();
      
      const { data, error } = await supabase
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

      if (error) {
        console.error('Error fetching comments:', error);
      } else {
        setLocalComments(data as any);
      }
      
      setLoadingComments(false);
    };

    fetchComments();
  }, [incidentId]);

  // Set up real-time subscription for comments (INSERT, UPDATE, DELETE)
  useEffect(() => {
    const supabase = createClient();

    console.log('🔔 CommentsSection: Setting up real-time for incident:', incidentId);

    const channel = supabase
      .channel(`comments-${incidentId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `incident_id=eq.${incidentId}`,
        },
        async (payload) => {
          console.log('💬 INSERT - New comment received:', payload);

          // Fetch the complete comment with user info
          const { data: newCommentData } = await supabase
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
            .eq('comment_id', payload.new.comment_id)
            .single();

          if (newCommentData) {
            setLocalComments((prev) => [...prev, newCommentData as any]);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'comments',
          filter: `incident_id=eq.${incidentId}`,
        },
        async (payload) => {
          console.log('✏️ UPDATE - Comment updated:', payload);

          // Fetch updated comment with user info
          const { data: updatedCommentData } = await supabase
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
            .eq('comment_id', payload.new.comment_id)
            .single();

          if (updatedCommentData) {
            setLocalComments((prev) =>
              prev.map((comment) =>
                comment.comment_id === updatedCommentData.comment_id
                  ? (updatedCommentData as any)
                  : comment
              )
            );
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'comments',
          filter: `incident_id=eq.${incidentId}`,
        },
        (payload) => {
          console.log('🗑️ DELETE - Comment deleted:', payload);

          // Remove deleted comment from local state
          setLocalComments((prev) =>
            prev.filter((comment) => comment.comment_id !== payload.old.comment_id)
          );
        }
      )
      .subscribe((status) => {
        console.log('📡 Comments subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [incidentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;

    const success = await createComment({
      incident_id: incidentId,
      content: newComment.trim(),
    });

    if (success) {
      setNewComment('');
      // Real-time will update localComments automatically
    }
  };

  return (
    <div className="bg-[#1A1E29] border-2 border-[#345473] rounded-[7px] p-6">
      <h2 className="text-xl font-bold text-white mb-4">Comentarios</h2>
      
      {/* Lista de comentarios */}
      <div className="space-y-4 mb-6">
        {localComments && localComments.length > 0 ? (
          localComments.map((comment) => (
            <div key={comment.comment_id} className="border-b border-[#345473] pb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-white font-semibold">
                    {comment.users?.full_name || 'Usuario'}
                  </p>
                </div>
                <p className="text-[#D9D9D9] text-sm">
                  {formatDate(comment.created_at)}
                </p>
              </div>
              <p className="text-[#D9D9D9]">{comment.content}</p>
            </div>
          ))
        ) : (
          <p className="text-[#D9D9D9] text-center py-8">
            No hay comentarios aún. Sé el primero en comentar.
          </p>
        )}
      </div>

      {/* Formulario para nuevo comentario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-[#D9D9D9] mb-2">
            Agregar Comentario
          </label>
          <textarea
            id="comment"
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full px-4 py-2 bg-[#132D46] border border-[#345473] rounded-[7px] text-white placeholder-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-[#00C48E] focus:border-transparent"
            placeholder="Escribe tu comentario aquí..."
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !newComment.trim()}
          className="px-6 py-2 bg-[#00C48E] text-white rounded-[7px] hover:bg-[#00A070] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Publicando...' : 'Publicar Comentario'}
        </button>
      </form>
    </div>
  );
}
