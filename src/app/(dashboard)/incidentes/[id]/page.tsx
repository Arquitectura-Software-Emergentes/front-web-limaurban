import React from 'react';
import Link from 'next/link';
import IncidenteCard from '../../../../components/incidents/IncidenteCard';
import ComentariosIncidente from '../../../../components/incidents/ComentariosIncidente';
import incidentsData from '../../../../data/incidents.json';

interface PageProps {
  params: { id: string };
}

export default async function IncidentePage(props: PageProps) {
  const params = await Promise.resolve(props.params);
  const incidente = incidentsData.incidents.find(inc => inc.id === params.id);

  if (!incidente || !incidente.comentarios) {
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
      <IncidenteCard incidente={incidente} />
      <ComentariosIncidente comentarios={incidente.comentarios} />
    </div>
  );
}