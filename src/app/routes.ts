export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  INCIDENTES: {
    LIST: '/dashboard',
    DETAIL: (id: string) => `/incidentes/${id}`,
  },
  MUNICIPALIDAD: '/municipalidad',
} as const;
