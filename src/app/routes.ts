export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  LOGIN: '/auth',
  REGISTER: '/auth',
  SIGNUP_SUCCESS: '/auth/signup-success',
  AUTH_ERROR: '/auth/error',
  AUTH_CONFIRM: '/auth/confirm',
  DASHBOARD: '/dashboard',
  INCIDENTS: {
    LIST: '/dashboard',
    DETAIL: (id: string) => `/incidents/${id}`,
  },
  MUNICIPALITY: '/municipality',
  MAPS: '/maps',
} as const;
