import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

async function middlewareHandler(request: NextRequest) {
  console.log("🚀 MIDDLEWARE EJECUTADO - Ruta:", request.nextUrl.pathname);

  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data } = await supabase.auth.getUser();
  const user = data.user;

  console.log("� MIDDLEWARE DEBUG:", {
    path: request.nextUrl.pathname,
    hasUser: !!user,
    email: user?.email,
  });

  const url = request.nextUrl.clone();

  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    console.log("❌ No user, redirecting to /auth");
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  if (user && (request.nextUrl.pathname === "/" || request.nextUrl.pathname.startsWith("/auth"))) {
    console.log("✅ User found, redirecting to /dashboard");
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  console.log("➡️ Access allowed");
  return response;
}

export default middlewareHandler;

export const config = {
  matcher: [
    "/",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
