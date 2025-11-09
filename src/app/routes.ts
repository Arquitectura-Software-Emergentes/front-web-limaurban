export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  LOGIN: '/auth',
  REGISTER: '/auth',
  DASHBOARD: '/dashboard',
  INCIDENTES: {
    LIST: '/dashboard',
    DETAIL: (id: string) => `/incidentes/${id}`,
  },
  MUNICIPALIDAD: '/municipalidad',
  MAPAS: '/mapas',
} as const;
