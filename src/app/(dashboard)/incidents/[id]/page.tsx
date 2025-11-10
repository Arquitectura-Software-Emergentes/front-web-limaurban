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
      <div className="max-w-4xl mx-auto p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-32 bg-[#1E2736] rounded"></div>
          <div className="h-8 w-64 bg-[#1E2736] rounded"></div>
          <div className="h-64 bg-[#1E2736] rounded"></div>
          <div className="h-48 bg-[#1E2736] rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !incident) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-white mb-4">Incidente no encontrado</p>
        <Link href="/dashboard" className="text-[#00C48E] hover:underline">
          Volver al dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex flex-col gap-4">
        <Link
          href="/dashboard"
          className="flex items-center px-4 py-2 bg-[#1A1E29] border border-[#00C48E] text-[#00C48E] hover:bg-[#034A36] rounded-[7px] transition-colors w-fit"
        >
          ← Volver
        </Link>
        <h1 className="text-2xl font-bold text-white">Detalle del Incidente</h1>
      </div>
      <IncidentCard incident={incident} />
      <CommentsSection 
        incidentId={incidentId} 
        comments={incident.comments || []} 
      />
    </div>
  );
}