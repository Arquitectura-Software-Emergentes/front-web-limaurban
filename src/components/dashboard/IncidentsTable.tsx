'use client';

import React, { useState, useMemo } from 'react';
import { useIncidents } from '@/hooks/useIncidents';
import TableFilters from './TableFilters';
import { useRouter } from 'next/navigation';
import { ROUTES } from '../../app/routes';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const getStatusColor = (status: string) => {
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
};

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

export default function IncidentsTable() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    distrito: '',
    tipo: '',
    prioridad: '',
    estado: '',
    fecha: ''
  });

  const { incidents, loading } = useIncidents();

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const filteredIncidents = useMemo(() => {
    if (!incidents) return [];
    
    return incidents.filter(incident => {
      if (filters.distrito && incident.district_code !== filters.distrito) return false;
      if (filters.estado && incident.status !== filters.estado) return false;
      if (filters.prioridad && incident.priority !== filters.prioridad) return false;
      if (filters.fecha) {
        const filterDate = filters.fecha;
        const incidentDate = incident.created_at.split('T')[0];
        if (filterDate !== incidentDate) return false;
      }
      return true;
    });
  }, [incidents, filters]);

  if (loading) {
    return (
      <div className="w-full overflow-x-auto">
        <TableFilters onFilterChange={handleFilterChange} />
        <div className="border-2 border-[#345473] rounded-[7px] min-w-[800px] p-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-[#1E2736] rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <TableFilters onFilterChange={handleFilterChange} />
      <div className="border-2 border-[#345473] rounded-[7px] min-w-[800px]">
        <table className="min-w-full">
          <thead className="bg-transparent">
            <tr className="border-b border-[#345473]">
              <th className="px-6 py-3 text-left text-xs font-medium text-[#FFFFFF] uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#FFFFFF] uppercase tracking-wider">Distrito</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#FFFFFF] uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#FFFFFF] uppercase tracking-wider">Prioridad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#FFFFFF] uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#FFFFFF] uppercase tracking-wider">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#345473]">
            {filteredIncidents.map((incident) => (
              <tr 
                key={incident.incident_id}
                onClick={() => router.push(ROUTES.INCIDENTS.DETAIL(incident.incident_id))}
                className="cursor-pointer hover:bg-[#1E2736] transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D9D9D9]">
                  {`IN-${incident.incident_id.slice(0, 8)}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D9D9D9]">
                  {incident.districts?.district_name || incident.district_code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D9D9D9]">
                  {incident.incident_categories?.name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D9D9D9]">
                  {translatePriority(incident.priority)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusColor(incident.status)}>
                    {translateStatus(incident.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D9D9D9]">
                  {formatDate(incident.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}