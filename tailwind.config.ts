import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0E2A45",
          50: "#e8eef4",
          100: "#c5d5e5",
          200: "#9fb9d4",
          300: "#789dc3",
          400: "#5888b7",
          500: "#3873ab",
          600: "#2a5b8a",
          700: "#1e4469",
          800: "#132d48",
          900: "#0E2A45",
        },
        teal: {
          DEFAULT: "#15B8A6",
          50: "#e6faf8",
          100: "#b3f0eb",
          200: "#7fe5de",
          300: "#4bdad1",
          400: "#17cfc4",
          500: "#15B8A6",
          600: "#109f8f",
          700: "#0c8678",
          800: "#086d61",
          900: "#04544a",
        },
      },
      fontFamily: {
        fraunces: ["var(--font-fraunces)", "Georgia", "serif"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "arc-draw": "arcDraw 1.2s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        arcDraw: {
          "0%": { strokeDashoffset: "600" },
          "100%": { strokeDashoffset: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
