import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#132D46] via-[#0F2537] to-[#132D46]">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">LimaUrban</h1>
        <p className="text-xl text-gray-300 mb-8">Sistema de Reporte de Incidentes Urbanos</p>
        <Link 
          href="/auth" 
          className="px-8 py-3 bg-[#00C48E] text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Comenzar
        </Link>
      </div>
    </div>
  );
}
