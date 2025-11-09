import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const token_hash = searchParams.get("token_hash") ?? searchParams.get("token");
  const code = searchParams.get("code");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/dashboard";

  const errorFromParams = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (errorFromParams) {
    const errorMessage = errorDescription || errorFromParams;
    redirect(`/auth/error?error=${encodeURIComponent(errorMessage)}`);
  }

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      redirect(next);
    } else {
      redirect(`/auth/error?error=${encodeURIComponent(error.message)}`);
    }
  }

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      redirect(next);
    } else {
      redirect(`/auth/error?error=${encodeURIComponent(error.message)}`);
    }
  }

  redirect(`/auth/error?error=${encodeURIComponent("No se encontró código de confirmación válido")}`);
}
