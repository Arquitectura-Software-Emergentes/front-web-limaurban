'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import IncidentCard from '@/components/incidents/IncidentCard';
import CommentsSection from '@/components/incidents/CommentsSection';
import { useIncident } from '@/hooks/useIncident';

export default function IncidentDetailPage() {
  const params = useParams();
  const incidentId = params.id as string;
  
  const { incident, loading, error } = useIncident(incidentId);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-24 bg-[#1A1E29] rounded"></div>
          <div className="h-8 w-48 bg-[#1A1E29] rounded"></div>
          <div className="h-96 bg-[#1A1E29] rounded-lg"></div>
          <div className="h-64 bg-[#1A1E29] rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error || !incident) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-center">
          <svg className="mx-auto h-16 w-16 text-[#345473] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">Incidente no encontrado</h3>
          <p className="text-[#9CA3AF] mb-6">
            {error || 'El incidente que buscas no existe o fue eliminado.'}
          </p>
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B0F19] border border-[#559BDE] text-[#559BDE] hover:bg-[#1A1E29] rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B0F19] border border-[#345473] text-[#559BDE] hover:border-[#559BDE] rounded-lg transition-all mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#E5E7EB]">Detalle del Incidente</h1>
      </div>

      {/* Content */}
      <IncidentCard incident={incident} />
      <CommentsSection 
        incidentId={incidentId} 
        comments={incident.comments || []} 
      />
    </div>
  );
}