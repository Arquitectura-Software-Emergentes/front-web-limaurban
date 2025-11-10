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

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'critical':
      return 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#4A1F1F] text-[#FF6B6B] border border-[#FF6B6B]';
    case 'high':
      return 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#452F09] text-[#FF9F43] border border-[#FF9F43]';
    case 'medium':
      return 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#3A3A1F] text-[#FFD93D] border border-[#FFD93D]';
    case 'low':
      return 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#1E3A2F] text-[#6BCF7F] border border-[#6BCF7F]';
    default:
      return 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#2D2D2D] text-[#999999] border border-[#999999]';
  }
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

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { incidents, loading } = useIncidents();

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const filteredIncidents = useMemo(() => {
    if (!incidents) return [];
    
    return incidents.filter(incident => {
      if (filters.distrito && incident.district_code !== filters.distrito) return false;
      if (filters.estado && incident.status !== filters.estado) return false;
      if (filters.prioridad && incident.priority !== filters.prioridad) return false;
      if (filters.tipo && incident.incident_categories?.code !== filters.tipo) return false;
      if (filters.fecha) {
        const filterDate = filters.fecha;
        const incidentDate = incident.created_at.split('T')[0];
        if (filterDate !== incidentDate) return false;
      }
      return true;
    });
  }, [incidents, filters]);

  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedIncidents = filteredIncidents.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="w-full overflow-x-auto">
        <TableFilters onFilterChange={handleFilterChange} activeFilters={filters} />
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
    <div className="w-full">
      <TableFilters onFilterChange={handleFilterChange} activeFilters={filters} />
      
      {/* Results Counter */}
      <div className="flex items-center justify-between px-4 mt-6 mb-3">
        <p className="text-sm text-[#9CA3AF]">
          Mostrando <span className="font-semibold text-[#E5E7EB]">{startIndex + 1}</span> - <span className="font-semibold text-[#E5E7EB]">{Math.min(endIndex, filteredIncidents.length)}</span> de <span className="font-semibold text-[#E5E7EB]">{filteredIncidents.length}</span> incidentes
        </p>
        <select
          value={itemsPerPage}
          onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
          className="hidden sm:block px-3 py-1.5 bg-[#0B0F19] border border-[#345473] rounded-md text-sm text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#559BDE] transition-all"
        >
          <option value={10}>10 por página</option>
          <option value={25}>25 por página</option>
          <option value={50}>50 por página</option>
          <option value={100}>100 por página</option>
        </select>
      </div>
      
      {/* Mobile: Cards Layout */}
      <div className="block lg:hidden space-y-3 px-4">
        {paginatedIncidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#0B0F19] border-2 border-[#345473] rounded-lg">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-[#345473] mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-base font-medium text-[#D9D9D9] mb-2">
                No hay incidentes registrados
              </h3>
              <p className="text-sm text-[#8B8B8B]">
                {filters.distrito || filters.estado || filters.prioridad || filters.fecha || filters.tipo
                  ? 'No se encontraron incidentes con los filtros aplicados.'
                  : 'Aún no se han reportado incidentes en el sistema.'}
              </p>
            </div>
          </div>
        ) : (
          paginatedIncidents.map((incident) => (
            <div
              key={incident.incident_id}
              onClick={() => router.push(ROUTES.INCIDENTS.DETAIL(incident.incident_id))}
              className="bg-[#0B0F19] border border-[#345473] rounded-lg p-4 active:scale-[0.98] hover:border-[#559BDE] transition-all duration-200 cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <p className="text-[10px] text-[#6B7280] font-mono mb-1.5 tracking-wide">
                    {`IN-${incident.incident_id.slice(0, 8).toUpperCase()}`}
                  </p>
                  <h3 className="text-base font-semibold text-[#E5E7EB] group-hover:text-[#559BDE] transition-colors">
                    {incident.incident_categories?.name || 'N/A'}
                  </h3>
                </div>
                <span className={getStatusColor(incident.status)}>
                  {translateStatus(incident.status)}
                </span>
              </div>
              
              <div className="space-y-2.5">
                <div className="flex items-center text-sm text-[#9CA3AF]">
                  <svg className="w-4 h-4 mr-2 text-[#6B7280] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium">{incident.districts?.district_name || incident.district_code}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm border-t border-[#1F2937] pt-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className={getPriorityBadge(incident.priority)}>
                      {translatePriority(incident.priority)}
                    </span>
                  </div>
                  <span className="text-xs text-[#6B7280] font-medium">
                    {formatDate(incident.created_at)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop: Table Layout */}
      <div className="hidden lg:block overflow-x-auto mt-6">
        <div className="border border-[#345473] rounded-lg overflow-hidden">
          {filteredIncidents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#0B0F19]">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-[#345473] mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-[#D9D9D9] mb-2">
                  No hay incidentes registrados
                </h3>
                <p className="text-sm text-[#8B8B8B]">
                  {filters.distrito || filters.estado || filters.prioridad || filters.fecha || filters.tipo
                    ? 'No se encontraron incidentes con los filtros aplicados.'
                    : 'Aún no se han reportado incidentes en el sistema.'}
                </p>
              </div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-[#345473]">
              <thead className="bg-[#0B0F19]">
                <tr>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">ID</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Distrito</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Tipo</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Prioridad</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-2.5 text-right text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Fecha</th>
                </tr>
              </thead>
              <tbody className="bg-[#0B0F19] divide-y divide-[#1F2937]">
                {paginatedIncidents.map((incident) => (
                  <tr 
                    key={incident.incident_id}
                    onClick={() => router.push(ROUTES.INCIDENTS.DETAIL(incident.incident_id))}
                    className="cursor-pointer hover:bg-[#1A1E29] transition-colors group"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-[#6B7280] font-mono">
                      {`IN-${incident.incident_id.slice(0, 8).toUpperCase()}`}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[#E5E7EB] group-hover:text-[#559BDE] transition-colors">
                      {incident.districts?.district_name || incident.district_code}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[#E5E7EB]">
                      {incident.incident_categories?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={getPriorityBadge(incident.priority)}>
                        {translatePriority(incident.priority)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={getStatusColor(incident.status)}>
                        {translateStatus(incident.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[#9CA3AF] text-right font-medium">
                      {formatDate(incident.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination */}
      {filteredIncidents.length > 0 && (
        <div className="mt-6 px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Mobile: Items per page */}
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="sm:hidden w-full px-3 py-2 bg-[#0B0F19] border border-[#345473] rounded-md text-sm text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#559BDE] transition-all"
            >
              <option value={10}>10 por página</option>
              <option value={25}>25 por página</option>
              <option value={50}>50 por página</option>
              <option value={100}>100 por página</option>
            </select>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-[#0B0F19] border border-[#345473] rounded-md text-sm font-medium text-[#E5E7EB] hover:bg-[#1A1E29] hover:border-[#559BDE] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0B0F19] disabled:hover:border-[#345473] transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Page Numbers - Desktop */}
              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                          currentPage === page
                            ? 'bg-[#0B0F19] text-[#559BDE] border-2 border-[#559BDE]'
                            : 'bg-[#0B0F19] text-[#E5E7EB] border border-[#345473] hover:bg-[#1A1E29] hover:border-[#559BDE]'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-2 text-[#6B7280]">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Page Info - Mobile */}
              <div className="sm:hidden px-4 py-2 bg-[#0B0F19] border border-[#345473] rounded-md">
                <span className="text-sm font-medium text-[#E5E7EB]">
                  {currentPage} / {totalPages}
                </span>
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-[#0B0F19] border border-[#345473] rounded-md text-sm font-medium text-[#E5E7EB] hover:bg-[#1A1E29] hover:border-[#559BDE] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0B0F19] disabled:hover:border-[#345473] transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Jump to page - Desktop only */}
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-sm text-[#9CA3AF]">Ir a:</span>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={currentPage}
                onChange={(e) => {
                  const page = parseInt(e.target.value);
                  if (page >= 1 && page <= totalPages) {
                    handlePageChange(page);
                  }
                }}
                className="w-16 px-2 py-1.5 bg-[#0B0F19] border border-[#345473] rounded-md text-sm text-[#E5E7EB] text-center focus:outline-none focus:ring-2 focus:ring-[#559BDE] transition-all"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}