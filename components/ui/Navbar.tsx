"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Chi sono", href: "#chi-sono" },
  { label: "Servizi", href: "#servizi" },
  { label: "Percorso", href: "#percorso" },
  { label: "Blog", href: "/blog" },
  { label: "Contatti", href: "#contatti" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link
          href="/"
          className={cn(
            "font-fraunces text-xl font-semibold tracking-tight transition-colors",
            scrolled ? "text-navy" : "text-white"
          )}
        >
          Federico <span className="text-teal">·</span> Fisioterapista
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "font-inter text-sm font-medium transition-colors hover:text-teal",
                scrolled ? "text-navy/70" : "text-white/80"
              )}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/prenota"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-teal px-6 py-3 font-inter text-base font-medium text-white shadow-lg shadow-teal/20 transition-all duration-200 hover:bg-teal-600 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
          >
            Prenota online
          </Link>
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? (
            <X size={22} className={scrolled ? "text-navy" : "text-white"} />
          ) : (
            <Menu size={22} className={scrolled ? "text-navy" : "text-white"} />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-5 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-inter text-navy/80 font-medium py-1"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/prenota"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-teal px-6 py-3 font-inter text-base font-medium text-white shadow-lg shadow-teal/20 transition-all duration-200 hover:bg-teal-600 active:scale-95 mt-2 w-full"
            onClick={() => setOpen(false)}
          >
            Prenota online
          </Link>
        </div>
      )}
    </header>
  );
}
