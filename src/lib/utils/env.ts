/**
 * Utility to check if Supabase environment variables are set
 */
export const hasEnvVars = 
  process.env.NEXT_PUBLIC_SUPABASE_URL !== undefined &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== undefined;
