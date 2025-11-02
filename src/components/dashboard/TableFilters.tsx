import React from 'react';
import { ChevronDown, MapPin, Wrench, AlertTriangle, Activity, Calendar, X } from 'lucide-react';
import incidentsData from '@/data/incidents.json';

interface FilterProps {
  onFilterChange: (field: string, value: string) => void;
}

const filterConfig = [
  { field: 'Distrito', icon: MapPin },
  { field: 'Tipo', icon: Wrench },
  { field: 'Prioridad', icon: AlertTriangle },
  { field: 'Estado', icon: Activity },
  { field: 'Fecha', icon: Calendar, type: 'date' }
];

export default function TableFilters({ onFilterChange }: FilterProps) {
  const getUniqueOptions = (field: string) => {
    const fieldKey = field.toLowerCase();
    const options = incidentsData.incidents.map(incident => {
      const value = incident[fieldKey as keyof typeof incident];
      return typeof value === 'string' ? value : '';
    }).filter(Boolean);
    return [...new Set(options)];
  };

  const handleClearFilters = () => {
    ['distrito', 'tipo', 'prioridad', 'estado', 'fecha'].forEach(field => {
      onFilterChange(field, '');
    });
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-[#FFFFFF] text-sm font-medium">Filtros</h2>
        <button
          onClick={handleClearFilters}
          className="flex items-center px-3 py-1 text-sm text-[#D9D9D9] bg-[#1A1E29] border border-[#345473] rounded-[7px] hover:border-[#00C48E] transition-colors"
        >
          <X size={14} className="mr-2" />
          Limpiar filtros
        </button>
      </div>
      <div className="grid grid-cols-5 gap-4 p-4">
        {filterConfig.map(({ field, icon: Icon, type }) => (
          <div key={field} className="relative">
            {type === 'date' ? (
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2" size={16} color="#00C48E" />
                <input
                  type="date"
                  onChange={(e) => onFilterChange(field.toLowerCase(), e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-[#1A1E29] border border-[#345473] rounded-[7px] text-[#D9D9D9] focus:outline-none focus:border-[#00C48E]"
                />
              </div>
            ) : (
              <>
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 z-10" size={16} color="#00C48E" />
                <select
                  onChange={(e) => onFilterChange(field.toLowerCase(), e.target.value)}
                  className="w-full pl-10 pr-8 py-2 text-sm bg-[#1A1E29] border border-[#345473] rounded-[7px] text-[#D9D9D9] appearance-none focus:outline-none focus:border-[#00C48E]"
                >
                  <option value="">{field}</option>
                  {getUniqueOptions(field).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2" size={16} color="#00C48E" />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}