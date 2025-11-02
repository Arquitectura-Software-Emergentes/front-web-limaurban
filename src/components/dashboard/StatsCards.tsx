import React from 'react';
import incidentsData from '@/data/incidents.json';

export default function StatsCards() {
  const totalIncidents = incidentsData.incidents.length;
  const pendingIncidents = incidentsData.incidents.filter(inc => inc.estado === 'Pendiente').length;
  const inProgressIncidents = incidentsData.incidents.filter(inc => inc.estado === 'En Proceso').length;
  const resolvedIncidents = incidentsData.incidents.filter(inc => inc.estado === 'Resuelto').length;

  const stats = [
    { 
      title: 'Total Incidentes', 
      count: totalIncidents, 
      bgColor: 'bg-[#091C2D]',
      textColor: 'text-[#559BDE]',
      borderColor: 'border-[#559BDE]'
    },
    { 
      title: 'Pendientes', 
      count: pendingIncidents, 
      bgColor: 'bg-[#3B1212]',
      textColor: 'text-[#D52D2D]',
      borderColor: 'border-[#D52D2D]'
    },
    { 
      title: 'En Proceso', 
      count: inProgressIncidents, 
      bgColor: 'bg-[#452F09]',
      textColor: 'text-[#C47C00]',
      borderColor: 'border-[#C47C00]'
    },
    { 
      title: 'Resueltos', 
      count: resolvedIncidents, 
      bgColor: 'bg-[#034A36]',
      textColor: 'text-[#00C48E]',
      borderColor: 'border-[#00C48E]'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`p-4 rounded-[5px] border-2 ${stat.borderColor} ${stat.bgColor} flex flex-col items-center justify-center text-center`}
        >
          <p className={`text-6xl ${stat.textColor} mt-2`}>{stat.count}</p>
          <h2 className={`${stat.textColor} text-lg mt-2`}>{stat.title}</h2>
        </div>
      ))}
    </div>
  );
}
