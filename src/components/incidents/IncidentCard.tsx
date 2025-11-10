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
  const reportedBy = incident.reported_by_user?.full_name || incident.reported_by_user?.email || 'Usuario desconocido';
  const assignedTo = incident.assigned_to_user?.full_name || incident.assigned_to_user?.email || 'Sin asignar';

  return (
    <div className="bg-[#0B0F19] border border-[#345473] rounded-lg p-4 sm:p-6 mb-6">
      {/* Mobile: Image first */}
      {incident.photo_url ? (
        <div className="relative w-full h-64 sm:h-80 rounded-lg overflow-hidden mb-6">
          <Image
            src={incident.photo_url}
            alt="Imagen del incidente"
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
            priority
          />
        </div>
      ) : (
        <div className="w-full h-64 sm:h-80 bg-[#1A1E29] border-2 border-dashed border-[#345473] rounded-lg flex items-center justify-center mb-6">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-[#345473] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-[#6B7280] text-sm">Sin imagen</p>
          </div>
        </div>
      )}

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <p className="text-[#6B7280] text-xs uppercase tracking-wide mb-1.5">ID</p>
          <p className="text-[#E5E7EB] font-mono text-sm">{`IN-${incident.incident_id.slice(0, 8).toUpperCase()}`}</p>
        </div>
        
        <div>
          <p className="text-[#6B7280] text-xs uppercase tracking-wide mb-1.5">Estado</p>
          <span className={getStatusColor(incident.status)}>
            {translateStatus(incident.status)}
          </span>
        </div>

        <div>
          <p className="text-[#6B7280] text-xs uppercase tracking-wide mb-1.5">Distrito</p>
          <p className="text-[#E5E7EB] font-medium">{districtName}</p>
        </div>

        <div>
          <p className="text-[#6B7280] text-xs uppercase tracking-wide mb-1.5">Categoría</p>
          <p className="text-[#E5E7EB] font-medium">{categoryName}</p>
        </div>

        <div>
          <p className="text-[#6B7280] text-xs uppercase tracking-wide mb-1.5">Prioridad</p>
          <p className="text-[#E5E7EB] font-medium">{translatePriority(incident.priority)}</p>
        </div>

        <div>
          <p className="text-[#6B7280] text-xs uppercase tracking-wide mb-1.5">Fecha</p>
          <p className="text-[#E5E7EB] font-medium">{formatDate(incident.created_at)}</p>
        </div>

        <div>
          <p className="text-[#6B7280] text-xs uppercase tracking-wide mb-1.5">Reportado por</p>
          <p className="text-[#E5E7EB] font-medium">{reportedBy}</p>
        </div>

        <div>
          <p className="text-[#6B7280] text-xs uppercase tracking-wide mb-1.5">Asignado a</p>
          <p className="text-[#E5E7EB] font-medium">{assignedTo}</p>
        </div>
      </div>

      {/* Description */}
      <div className="mt-6 pt-6 border-t border-[#345473]">
        <p className="text-[#6B7280] text-xs uppercase tracking-wide mb-2">Descripción</p>
        <p className="text-[#E5E7EB] leading-relaxed">{incident.description}</p>
      </div>

      {/* Address */}
      {incident.address_line && (
        <div className="mt-4 pt-4 border-t border-[#345473]">
          <p className="text-[#6B7280] text-xs uppercase tracking-wide mb-2">Dirección</p>
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-[#559BDE] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-[#E5E7EB]">{incident.address_line}</p>
          </div>
        </div>
      )}

      {/* Coordinates */}
      <div className="mt-4 pt-4 border-t border-[#345473]">
        <p className="text-[#6B7280] text-xs uppercase tracking-wide mb-2">Coordenadas</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[#6B7280] text-sm">Latitud:</span>
            <code className="text-[#E5E7EB] text-sm font-mono bg-[#1A1E29] px-2 py-1 rounded">
              {incident.latitude.toFixed(6)}
            </code>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#6B7280] text-sm">Longitud:</span>
            <code className="text-[#E5E7EB] text-sm font-mono bg-[#1A1E29] px-2 py-1 rounded">
              {incident.longitude.toFixed(6)}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
