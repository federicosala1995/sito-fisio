"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { RomArc } from "@/components/ui/RomArc";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Bell,
  LogOut,
  ExternalLink,
  TrendingUp,
  ClipboardList,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Calendar, label: "Agenda", href: "/dashboard/agenda" },
  { icon: Users, label: "Pazienti", href: "/dashboard/pazienti" },
  { icon: Bell, label: "Promemoria", href: "/dashboard/promemoria" },
  { icon: TrendingUp, label: "Statistiche", href: "/dashboard/statistiche" },
  { icon: ClipboardList, label: "Lista attesa", href: "/dashboard/lista-attesa" },
];

export function DashNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-navy text-white px-5 py-8">
        <div className="flex items-center gap-3 mb-10">
          <RomArc variant="mini" size={36} animated={false} className="text-teal" />
          <div>
            <p className="font-fraunces text-base font-semibold">Federico</p>
            <p className="font-inter text-xs text-white/40">Fisioterapista</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map(({ icon: Icon, label, href }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-inter text-sm transition-all",
                pathname === href
                  ? "bg-teal text-white"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="space-y-2 border-t border-white/10 pt-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-inter text-xs text-white/35 hover:text-white/60 transition-colors"
          >
            <ExternalLink size={14} />
            Vai al sito
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-inter text-xs text-white/35 hover:text-red-400 transition-colors text-left"
          >
            <LogOut size={14} />
            Esci
          </button>
        </div>
      </aside>

      {/* Bottom nav mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-navy border-t border-white/10 flex z-40">
        {navItems.map(({ icon: Icon, label, href }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 py-3 font-inter text-xs transition-colors",
              pathname === href ? "text-teal" : "text-white/40"
            )}
          >
            <Icon size={18} />
            <span className="text-[10px]">{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
