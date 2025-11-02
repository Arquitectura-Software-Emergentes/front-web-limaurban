import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = await cookies();
  const session = cookieStore.get('supabase-auth-token');

  // Si hay sesión, redirigir al dashboard
  if (session) {
    redirect('/dashboard');
  }

  // Si no hay sesión, redirigir al login
  redirect('/login');
}
