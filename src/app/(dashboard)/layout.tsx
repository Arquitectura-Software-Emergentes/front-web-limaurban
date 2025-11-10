import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/layout/Sidebar";
import SessionHandler from "@/components/auth/SessionHandler";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  return (
    <div className="min-h-screen flex">
      <SessionHandler />
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">{children}</main>
    </div>
  );
}