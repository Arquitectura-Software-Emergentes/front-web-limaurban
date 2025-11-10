'use client';

import React, { useState } from 'react';
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
  comments: Comment[];
}

export default function CommentsSection({ incidentId, comments }: CommentsSectionProps) {
  const [newComment, setNewComment] = useState('');
  const { createComment, loading } = useComments();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;

    const success = await createComment({
      incident_id: incidentId,
      content: newComment.trim(),
    });

    if (success) {
      setNewComment('');
      window.location.reload();
    }
  };

  return (
    <div className="bg-[#1A1E29] border-2 border-[#345473] rounded-[7px] p-6">
      <h2 className="text-xl font-bold text-white mb-4">Comentarios</h2>
      
      {/* Lista de comentarios */}
      <div className="space-y-4 mb-6">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
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
