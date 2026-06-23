"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface RomArcProps {
  className?: string;
  size?: number;
  animated?: boolean;
  variant?: "hero" | "section" | "mini";
}

// Arrotonda a 4 decimali per avere coordinate identiche tra SSR e client
const r4 = (n: number) => Math.round(n * 10000) / 10000;

export function RomArc({ className, size = 420, animated = true, variant = "hero" }: RomArcProps) {
  const ref = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (!animated || !ref.current) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      ref.current.style.strokeDashoffset = "0";
      return;
    }
    ref.current.style.animation = "arcDraw 1.4s cubic-bezier(0.4,0,0.2,1) forwards";
  }, [animated]);

  const rr = r4(size * 0.38);
  const cx = r4(size / 2);
  const cy = r4(size / 2 + size * 0.05);
  const circumference = r4(2 * Math.PI * rr);
  const arcLength = r4(circumference * 0.6);

  if (variant === "mini") {
    return (
      <svg
        width={64}
        height={64}
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
        className={cn("text-teal", className)}
      >
        <path
          d="M 8 56 A 28 28 0 0 1 56 56"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <line x1="32" y1="56" x2="32" y2="28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="32" y1="56" x2="52" y2="36" stroke="#0E2A45" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="32" cy="56" r="3" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={r4(size * 0.72)}
      viewBox={`0 0 ${size} ${r4(size * 0.72)}`}
      fill="none"
      aria-hidden="true"
      className={cn("select-none", className)}
    >
      {/* Tick marks */}
      {Array.from({ length: 13 }).map((_, i) => {
        const angle = -210 + i * (216 / 12);
        const rad = (angle * Math.PI) / 180;
        const outerR = r4(i % 3 === 0 ? 22 : 14);
        const x1 = r4(cx + (rr + 8) * Math.cos(rad));
        const y1 = r4(cy + (rr + 8) * Math.sin(rad));
        const x2 = r4(cx + (rr + outerR) * Math.cos(rad));
        const y2 = r4(cy + (rr + outerR) * Math.sin(rad));
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={i % 3 === 0 ? "#15B8A6" : "#0E2A4530"}
            strokeWidth={i % 3 === 0 ? 2 : 1}
            strokeLinecap="round"
          />
        );
      })}

      {/* Degree labels */}
      {[0, 45, 90, 135, 180].map((deg) => {
        const angle = -210 + (deg / 180) * 216;
        const rad = (angle * Math.PI) / 180;
        const x = r4(cx + (rr + 38) * Math.cos(rad));
        const y = r4(cy + (rr + 38) * Math.sin(rad));
        return (
          <text
            key={deg}
            x={x} y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={r4(size * 0.028)}
            fontFamily="Inter, sans-serif"
            fill="#0E2A4560"
          >
            {deg}°
          </text>
        );
      })}

      {/* Background arc */}
      <circle
        cx={cx} cy={cy} r={rr}
        stroke="#0E2A4510"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${arcLength} ${circumference}`}
        strokeDashoffset={r4(-circumference * 0.2)}
        fill="none"
        transform={`rotate(-210 ${cx} ${cy})`}
      />

      {/* Animated teal arc */}
      <circle
        ref={ref}
        cx={cx} cy={cy} r={rr}
        stroke="#15B8A6"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={`${r4(arcLength * 0.75)} ${circumference}`}
        strokeDashoffset={animated ? arcLength : 0}
        fill="none"
        transform={`rotate(-210 ${cx} ${cy})`}
        style={{ transition: "stroke-dashoffset 0s" }}
      />

      {/* Arm — fixed */}
      <line
        x1={cx} y1={cy}
        x2={r4(cx + rr * 0.85 * Math.cos((-210 * Math.PI) / 180))}
        y2={r4(cy + rr * 0.85 * Math.sin((-210 * Math.PI) / 180))}
        stroke="#0E2A45"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Arm — mobile (135°) */}
      <line
        x1={cx} y1={cy}
        x2={r4(cx + rr * 0.85 * Math.cos(((-210 + 216 * 0.63) * Math.PI) / 180))}
        y2={r4(cy + rr * 0.85 * Math.sin(((-210 + 216 * 0.63) * Math.PI) / 180))}
        stroke="#15B8A6"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Center pivot */}
      <circle cx={cx} cy={cy} r={r4(size * 0.018)} fill="#15B8A6" />
      <circle cx={cx} cy={cy} r={r4(size * 0.009)} fill="white" />
    </svg>
  );
}
