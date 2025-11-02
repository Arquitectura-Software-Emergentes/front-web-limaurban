import React, { useState, useMemo } from 'react';
import incidentsData from '@/data/incidents.json';
import TableFilters from './TableFilters';
import { useRouter } from 'next/navigation';
import { ROUTES } from '../../app/routes';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Resuelto':
      return 'bg-[#034A36] text-[#00C48E] border border-[#00C48E] px-3 py-1 rounded-full text-xs font-semibold';
    case 'Pendiente':
      return 'bg-[#3B1212] text-[#D52D2D] border border-[#D52D2D] px-3 py-1 rounded-full text-xs font-semibold';
    case 'En Proceso':
      return 'bg-[#452F09] text-[#C47C00] border border-[#C47C00] px-3 py-1 rounded-full text-xs font-semibold';
    default:
      return 'bg-[#034A36] text-[#00C48E] border border-[#00C48E] px-3 py-1 rounded-full text-xs font-semibold';
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

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const filteredIncidents = useMemo(() => {
    return incidentsData.incidents.filter(incident => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        
        if (key === 'fecha') {
          // Obtener solo la parte de la fecha (YYYY-MM-DD)
          const filterDate = value;
          const incidentDate = incident[key].split('T')[0];
          
          console.log('Comparing dates:', {
            filter: filterDate,
            incident: incidentDate,
            match: filterDate === incidentDate
          });
          
          return filterDate === incidentDate;
        }

        const incidentValue = incident[key as keyof typeof incident]?.toString().toLowerCase();
        return incidentValue?.includes(value.toLowerCase());
      });
    });
  }, [filters]);

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
                key={incident.id}
                onClick={() => router.push(ROUTES.INCIDENTES.DETAIL(incident.id))}
                className="cursor-pointer hover:bg-[#1E2736] transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D9D9D9]">
                  {`IN-${incident.id.padStart(2, '0')}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D9D9D9]">{incident.distrito}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D9D9D9]">{incident.tipo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D9D9D9]">{incident.prioridad}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusColor(incident.estado)}>
                    {incident.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D9D9D9]">
                  {new Date(incident.fecha).toLocaleDateString('es-ES')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}