'use client';

import React from 'react';
import { useIncidents } from '@/hooks/useIncidents';

export default function StatsCards() {
  const { incidents, loading } = useIncidents();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="p-4 rounded-[5px] border-2 border-[#345473] bg-[#1A1E29] flex flex-col items-center justify-center text-center animate-pulse"
          >
            <div className="h-16 w-24 bg-[#345473] rounded mb-2"></div>
            <div className="h-6 w-32 bg-[#345473] rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const totalIncidents = incidents.length;
  const pendingIncidents = incidents.filter(inc => inc.status === 'pending').length;
  const inReviewIncidents = incidents.filter(inc => inc.status === 'in_review').length;
  const inProgressIncidents = incidents.filter(inc => inc.status === 'in_progress').length;
  const resolvedIncidents = incidents.filter(inc => inc.status === 'resolved').length;

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
      title: 'En Revisión', 
      count: inReviewIncidents, 
      bgColor: 'bg-[#1E3A5F]',
      textColor: 'text-[#5B9BD5]',
      borderColor: 'border-[#5B9BD5]'
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
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
