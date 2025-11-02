import React from 'react';

interface Comentario {
  id: string;
  autor: string;
  cargo: string;
  fecha: string;
  mensaje: string;
}

interface ComentariosIncidenteProps {
  comentarios: Comentario[];
}

export default function ComentariosIncidente({ comentarios = [] }: ComentariosIncidenteProps) {
  return (
    <div className="bg-[#1A1E29] border-2 border-[#345473] rounded-[7px] p-6">
      <h2 className="text-xl font-medium text-white mb-6">Comentarios</h2>
      <div className="space-y-6">
        {comentarios.map((comentario) => (
          <div key={comentario.id} className="border-b border-[#345473] last:border-0 pb-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-[#00C48E] font-medium">{comentario.autor}</p>
                <p className="text-[#D9D9D9] text-sm">{comentario.cargo}</p>
              </div>
              <p className="text-[#D9D9D9] text-sm">
                {new Date(comentario.fecha).toLocaleDateString('es-ES')}
              </p>
            </div>
            <p className="text-[#D9D9D9] mt-2">{comentario.mensaje}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
