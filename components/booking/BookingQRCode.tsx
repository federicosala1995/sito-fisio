"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

interface Props {
  url?: string;
}

export function BookingQRCode({ url }: Props) {
  const [bookingUrl, setBookingUrl] = useState<string | null>(null);

  useEffect(() => {
    setBookingUrl(url ?? `${window.location.origin}/prenota`);
  }, [url]);

  if (!bookingUrl) return null;

  return (
    <div className="flex flex-col items-center gap-4 p-6 rounded-2xl border border-gray-100 bg-white">
      <div className="p-3 rounded-xl border border-gray-100 bg-white shadow-sm">
        <QRCodeSVG
          value={bookingUrl}
          size={160}
          fgColor="#0E2A45"
          bgColor="#ffffff"
          level="M"
          imageSettings={{
            src: "/favicon.ico",
            x: undefined,
            y: undefined,
            height: 28,
            width: 28,
            excavate: true,
          }}
        />
      </div>
      <div className="text-center">
        <p className="font-fraunces text-sm font-semibold text-navy">Prenota con il QR</p>
        <p className="font-inter text-xs text-navy/45 mt-0.5">
          Scansiona con la fotocamera del telefono
        </p>
      </div>
    </div>
  );
}
