import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils/env";

/**
 * Middleware function to update Supabase session
 * Handles authentication and redirects
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // If the env vars are not set, skip middleware check
  if (!hasEnvVars) {
    return supabaseResponse;
  }

  // Permitir acceso a assets sin autenticación
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/images') ||
    request.nextUrl.pathname.startsWith('/assets') ||
    request.nextUrl.pathname.includes('.') // archivos estáticos
  ) {
    return supabaseResponse;
  }

  // Create Supabase client for middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: Do not run code between createServerClient and getClaims()
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // Rutas que NO requieren autenticación
  const isAuthRoute = request.nextUrl.pathname === '/auth';
  const isAuthConfirmRoute = request.nextUrl.pathname.startsWith('/auth/confirm');
  const isAuthSuccessRoute = request.nextUrl.pathname === '/auth/signup-success';
  const isAuthErrorRoute = request.nextUrl.pathname === '/auth/error';
  const isPublicRoute = request.nextUrl.pathname === '/';

  // Rutas públicas que no requieren autenticación
  const publicRoutes = [isAuthRoute, isAuthConfirmRoute, isAuthSuccessRoute, isAuthErrorRoute, isPublicRoute];
  const isPublicAccess = publicRoutes.some(Boolean);

  // Si no hay usuario Y NO está en rutas públicas → redirigir a /auth
  if (!user && !isPublicAccess) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  // Si hay usuario Y está en /auth (pero NO en confirm/error/success) → redirigir al dashboard
  if (user && isAuthRoute && !isAuthConfirmRoute && !isAuthErrorRoute && !isAuthSuccessRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  return supabaseResponse;
}
