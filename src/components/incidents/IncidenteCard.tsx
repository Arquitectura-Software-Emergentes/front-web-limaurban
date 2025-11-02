import React from 'react';

function getStatusColor(estado: string) {
  switch (estado) {
    case 'Resuelto':
      return 'bg-[#034A36] text-[#00C48E] border border-[#00C48E] px-3 py-1 rounded-full text-xs font-semibold';
    case 'Pendiente':
      return 'bg-[#3B1212] text-[#D52D2D] border border-[#D52D2D] px-3 py-1 rounded-full text-xs font-semibold';
    case 'En Proceso':
      return 'bg-[#452F09] text-[#C47C00] border border-[#C47C00] px-3 py-1 rounded-full text-xs font-semibold';
    default:
      return 'bg-[#034A36] text-[#00C48E] border border-[#00C48E] px-3 py-1 rounded-full text-xs font-semibold';
  }
}

interface IncidenteCardProps {
  incidente: {
    id: string;
    distrito: string;
    tipo: string;
    prioridad: string;
    estado: string;
    fecha: string;
    imagen: string;
    comentarios: {
      id: string;
      autor: string;
      cargo: string;
      fecha: string;
      mensaje: string;
    }[];
  };
}

export default function IncidenteCard({ incidente }: IncidenteCardProps) {
  return (
    <div className="bg-[#1A1E29] border-2 border-[#345473] rounded-[7px] p-6 mb-6">
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[#D9D9D9] text-sm">ID</p>
              <p className="text-white font-medium">{`IN-${incidente.id.padStart(2, '0')}`}</p>
            </div>
            <div>
              <p className="text-[#D9D9D9] text-sm">Distrito</p>
              <p className="text-white font-medium">{incidente.distrito}</p>
            </div>
            <div>
              <p className="text-[#D9D9D9] text-sm">Tipo</p>
              <p className="text-white font-medium">{incidente.tipo}</p>
            </div>
            <div>
              <p className="text-[#D9D9D9] text-sm">Prioridad</p>
              <p className="text-white font-medium">{incidente.prioridad}</p>
            </div>
            <div>
              <p className="text-[#D9D9D9] text-sm">Estado</p>
              <span className={getStatusColor(incidente.estado)}>{incidente.estado}</span>
            </div>
            <div>
              <p className="text-[#D9D9D9] text-sm">Fecha</p>
              <p className="text-white font-medium">
                {new Date(incidente.fecha).toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
        </div>
        <div className="w-64">
          <img
            src={incidente.imagen}
            alt="Imagen del incidente"
            className="w-full h-48 object-cover rounded-[7px]"
          />
        </div>
      </div>
    </div>
  );
}