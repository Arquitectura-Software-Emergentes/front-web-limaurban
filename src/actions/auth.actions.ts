"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UserType } from "@/types";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  userType: UserType;
}

export async function login(credentials: LoginCredentials) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function register(data: RegisterData) {
  const supabase = await createClient();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${baseUrl}/auth/confirm?next=/dashboard`,
      data: {
        full_name: data.fullName,
        phone: data.phone || null,
        user_type: data.userType,
      },
    },
  });

  if (signUpError) {
    return { success: false, error: signUpError.message };
  }

  if (!authData.user) {
    return { success: false, error: "No se pudo crear el usuario" };
  }

  return { success: true, message: "Cuenta creada exitosamente. Revisa tu correo para confirmar tu cuenta." };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/auth");
}
