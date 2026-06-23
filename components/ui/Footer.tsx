import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { RomArc } from "./RomArc";

export function Footer() {
  return (
    <footer className="bg-navy text-white/80">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <RomArc variant="mini" size={48} animated={false} className="text-teal" />
              <div>
                <p className="font-fraunces text-xl font-semibold text-white">Federico</p>
                <p className="text-sm text-white/50 font-inter">Fisioterapista</p>
              </div>
            </div>
            <p className="font-inter text-sm leading-relaxed text-white/60">
              Fisioterapista libero professionista a Castrezzato (BS), zona Franciacorta.
              Iscritto all&apos;Albo TSRM-PSTRP.
            </p>
            <p className="font-inter text-xs text-white/40">
              P.IVA: <span className="font-semibold text-white/50">[INSERIRE P.IVA]</span>
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <p className="font-inter text-xs uppercase tracking-widest text-teal font-semibold mb-4">
              Navigazione
            </p>
            {[
              ["Chi sono", "#chi-sono"],
              ["Servizi", "#servizi"],
              ["Prenota online", "/prenota"],
              ["Blog", "/blog"],
              ["Area riservata", "/dashboard"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="block font-inter text-sm text-white/60 hover:text-teal transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Contacts */}
          <div className="space-y-3">
            <p className="font-inter text-xs uppercase tracking-widest text-teal font-semibold mb-4">
              Contatti
            </p>
            <a
              href="tel:+393454431758"
              className="flex items-center gap-3 font-inter text-sm text-white/60 hover:text-teal transition-colors"
            >
              <Phone size={15} className="shrink-0" />
              +39 345 443 1758
            </a>
            <a
              href="https://wa.me/393454431758"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 font-inter text-sm text-white/60 hover:text-teal transition-colors"
            >
              <MessageCircle size={15} className="shrink-0" />
              WhatsApp
            </a>
            <a
              href="mailto:[EMAIL]"
              className="flex items-center gap-3 font-inter text-sm text-white/60 hover:text-teal transition-colors"
            >
              <Mail size={15} className="shrink-0" />
              [EMAIL DA INSERIRE]
            </a>
            <div className="flex items-start gap-3 font-inter text-sm text-white/60">
              <MapPin size={15} className="shrink-0 mt-0.5" />
              <span>Castrezzato (BS), Franciacorta<br />[INDIRIZZO DA INSERIRE]</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-inter text-xs text-white/30">
            © {new Date().getFullYear()} Federico — Fisioterapista. Tutti i diritti riservati.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="font-inter text-xs text-white/30 hover:text-teal transition-colors">
              Privacy Policy
            </Link>
            <Link href="/cookie" className="font-inter text-xs text-white/30 hover:text-teal transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
