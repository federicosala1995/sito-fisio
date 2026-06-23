import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashNav } from "@/components/dashboard/DashNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("XXXXXXXXXX");

  if (!supabaseConfigured) redirect("/login");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashNav />
      <main className="flex-1 ml-0 md:ml-64 p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
