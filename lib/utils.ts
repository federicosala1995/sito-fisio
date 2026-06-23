import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function calcAge(dataNascita: string): number {
  const today = new Date();
  const born = new Date(dataNascita);
  let age = today.getFullYear() - born.getFullYear();
  const m = today.getMonth() - born.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < born.getDate())) age--;
  return age;
}

export function whatsappUrl(message?: string): string {
  const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "393454431758";
  const text = message ? encodeURIComponent(message) : "";
  return `https://wa.me/${num}${text ? `?text=${text}` : ""}`;
}
