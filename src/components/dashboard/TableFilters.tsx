'use client';

import React, { useState } from 'react';
import { ChevronDown, MapPin, Wrench, AlertTriangle, Activity, Calendar, X } from 'lucide-react';
import { useDistricts } from '@/hooks/useDistricts';
import { useCategories } from '@/hooks/useCategories';

interface FilterProps {
  onFilterChange: (field: string, value: string) => void;
  activeFilters: Record<string, string>;
}

const statusOptions = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'in_review', label: 'En Revisión' },
  { value: 'in_progress', label: 'En Progreso' },
  { value: 'resolved', label: 'Resuelto' },
  { value: 'closed', label: 'Cerrado' },
  { value: 'rejected', label: 'Rechazado' }
];

const priorityOptions = [
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
  { value: 'critical', label: 'Crítica' }
];

export default function TableFilters({ onFilterChange, activeFilters }: FilterProps) {
  const { districts, loading: loadingDistricts } = useDistricts();
  const { categories, loading: loadingCategories } = useCategories();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const hasActiveFilters = Object.values(activeFilters).some(value => value !== '');

  const handleClearFilters = () => {
    ['distrito', 'tipo', 'prioridad', 'estado', 'fecha'].forEach(field => {
      onFilterChange(field, '');
    });
    setIsMobileMenuOpen(false);
  };

  const FilterSelect = ({ 
    field, 
    icon: Icon, 
    options, 
    loading = false,
    placeholder 
  }: { 
    field: string; 
    icon: React.ElementType; 
    options: { value: string; label: string }[];
    loading?: boolean;
    placeholder: string;
  }) => (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none" size={16} color="#00C48E" />
      <select
        value={activeFilters[field] || ''}
        onChange={(e) => onFilterChange(field, e.target.value)}
        disabled={loading}
        className="w-full pl-10 pr-8 py-2.5 text-sm bg-[#1A1E29] border border-[#345473] rounded-lg text-[#D9D9D9] appearance-none focus:outline-none focus:border-[#00C48E] focus:ring-1 focus:ring-[#00C48E] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">{loading ? 'Cargando...' : placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" size={16} color="#00C48E" />
    </div>
  );

  const FilterDate = () => (
    <div className="relative">
      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none" size={16} color="#00C48E" />
      <input
        type="date"
        value={activeFilters['fecha'] || ''}
        onChange={(e) => onFilterChange('fecha', e.target.value)}
        placeholder="dd/mm/aaaa"
        className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#1A1E29] border border-[#345473] rounded-lg text-[#D9D9D9] focus:outline-none focus:border-[#00C48E] focus:ring-1 focus:ring-[#00C48E] transition-all [color-scheme:dark]"
      />
    </div>
  );

  return (
    <div className="mb-6">
      {/* Header - Mobile & Desktop */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 px-4">
        <h2 className="text-[#FFFFFF] text-base sm:text-sm font-medium">Filtros</h2>
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center justify-center px-4 py-2 text-sm text-[#D9D9D9] bg-[#1A1E29] border border-[#345473] rounded-lg hover:border-[#00C48E] transition-all active:scale-95"
            >
              <X size={14} className="mr-2" />
              Limpiar filtros
            </button>
          )}
          {/* Mobile Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden flex items-center justify-center px-4 py-2 text-sm text-[#00C48E] bg-[#1A1E29] border border-[#345473] rounded-lg active:scale-95"
          >
            {isMobileMenuOpen ? 'Ocultar' : 'Mostrar'} filtros
            <ChevronDown 
              size={16} 
              className={`ml-2 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Filters Grid - Mobile Collapsible, Desktop Always Visible */}
      <div className={`
        px-4 
        ${isMobileMenuOpen ? 'block' : 'hidden'} 
        sm:block
      `}>
        {/* Mobile: Stack vertically */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Distrito Filter */}
          <FilterSelect
            field="distrito"
            icon={MapPin}
            placeholder="Distrito"
            loading={loadingDistricts}
            options={districts.map(d => ({ value: d.district_code, label: d.district_name }))}
          />

          {/* Tipo Filter */}
          <FilterSelect
            field="tipo"
            icon={Wrench}
            placeholder="Tipo"
            loading={loadingCategories}
            options={categories.map(c => ({ value: c.code, label: c.name }))}
          />

          {/* Prioridad Filter */}
          <FilterSelect
            field="prioridad"
            icon={AlertTriangle}
            placeholder="Prioridad"
            options={priorityOptions}
          />

          {/* Estado Filter */}
          <FilterSelect
            field="estado"
            icon={Activity}
            placeholder="Estado"
            options={statusOptions}
          />

          {/* Fecha Filter */}
          <FilterDate />
        </div>

        {/* Active Filters Tags - Mobile */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-4 sm:hidden">
            {Object.entries(activeFilters).map(([key, value]) => {
              if (!value) return null;
              
              let displayValue = value;
              if (key === 'distrito') {
                const district = districts.find(d => d.district_code === value);
                displayValue = district?.district_name || value;
              } else if (key === 'tipo') {
                const category = categories.find(c => c.code === value);
                displayValue = category?.name || value;
              } else if (key === 'estado') {
                const status = statusOptions.find(s => s.value === value);
                displayValue = status?.label || value;
              } else if (key === 'prioridad') {
                const priority = priorityOptions.find(p => p.value === value);
                displayValue = priority?.label || value;
              }

              return (
                <span
                  key={key}
                  className="inline-flex items-center px-3 py-1 text-xs bg-[#345473] text-[#D9D9D9] rounded-full"
                >
                  {displayValue}
                  <button
                    onClick={() => onFilterChange(key, '')}
                    className="ml-2 hover:text-[#00C48E]"
                  >
                    <X size={12} />
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
