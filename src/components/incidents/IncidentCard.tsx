import React from 'react';
import Image from 'next/image';
import { Incident } from '@/types';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

function getStatusColor(status: string) {
  switch (status) {
    case 'resolved':
      return 'bg-[#034A36] text-[#00C48E] border border-[#00C48E] px-3 py-1 rounded-full text-xs font-semibold';
    case 'pending':
      return 'bg-[#3B1212] text-[#D52D2D] border border-[#D52D2D] px-3 py-1 rounded-full text-xs font-semibold';
    case 'in_progress':
      return 'bg-[#452F09] text-[#C47C00] border border-[#C47C00] px-3 py-1 rounded-full text-xs font-semibold';
    case 'in_review':
      return 'bg-[#1E3A5F] text-[#5B9BD5] border border-[#5B9BD5] px-3 py-1 rounded-full text-xs font-semibold';
    case 'closed':
      return 'bg-[#2D2D2D] text-[#999999] border border-[#999999] px-3 py-1 rounded-full text-xs font-semibold';
    case 'rejected':
      return 'bg-[#4A1F1F] text-[#FF6B6B] border border-[#FF6B6B] px-3 py-1 rounded-full text-xs font-semibold';
    default:
      return 'bg-[#034A36] text-[#00C48E] border border-[#00C48E] px-3 py-1 rounded-full text-xs font-semibold';
  }
}

const translateStatus = (status: string) => {
  const translations: Record<string, string> = {
    'pending': 'Pendiente',
    'in_review': 'En Revisión',
    'in_progress': 'En Proceso',
    'resolved': 'Resuelto',
    'closed': 'Cerrado',
    'rejected': 'Rechazado'
  };
  return translations[status] || status;
};

const translatePriority = (priority: string) => {
  const translations: Record<string, string> = {
    'low': 'Baja',
    'medium': 'Media',
    'high': 'Alta',
    'critical': 'Crítica'
  };
  return translations[priority] || priority;
};

interface IncidentCardProps {
  incident: Incident;
}

export default function IncidentCard({ incident }: IncidentCardProps) {
  const districtName = incident.districts?.district_name || incident.district_code;
  const categoryName = incident.incident_categories?.name || 'N/A';

  return (
    <div className="bg-[#1A1E29] border-2 border-[#345473] rounded-[7px] p-6 mb-6">
      <div className="flex gap-6 flex-col md:flex-row">
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[#D9D9D9] text-sm">ID</p>
              <p className="text-white font-medium">{`IN-${incident.incident_id.slice(0, 8)}`}</p>
            </div>
            <div>
              <p className="text-[#D9D9D9] text-sm">Distrito</p>
              <p className="text-white font-medium">
                {districtName}
              </p>
            </div>
            <div>
              <p className="text-[#D9D9D9] text-sm">Categoría</p>
              <p className="text-white font-medium">
                {categoryName}
              </p>
            </div>
            <div>
              <p className="text-[#D9D9D9] text-sm">Prioridad</p>
              <p className="text-white font-medium">{translatePriority(incident.priority)}</p>
            </div>
            <div>
              <p className="text-[#D9D9D9] text-sm">Estado</p>
              <span className={getStatusColor(incident.status)}>
                {translateStatus(incident.status)}
              </span>
            </div>
            <div>
              <p className="text-[#D9D9D9] text-sm">Fecha</p>
              <p className="text-white font-medium">
                {formatDate(incident.created_at)}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[#D9D9D9] text-sm mb-2">Descripción</p>
            <p className="text-white">{incident.description}</p>
          </div>
          {incident.address_line && (
            <div className="mt-4">
              <p className="text-[#D9D9D9] text-sm mb-2">Dirección</p>
              <p className="text-white">{incident.address_line}</p>
            </div>
          )}
        </div>
          {incident.photo_url ? (
            <div className="relative w-full h-48 rounded-[7px] overflow-hidden">
              <Image
                src={incident.photo_url}
                alt="Imagen del incidente"
                fill
                sizes="(max-width: 768px) 100vw, 256px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-48 bg-[#132D46] rounded-[7px] flex items-center justify-center">
              <p className="text-[#D9D9D9]">Sin imagen</p>
            </div>
          )}
        </div>
      </div>
  );
}
