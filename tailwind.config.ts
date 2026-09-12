import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        "dm-sans": ["var(--font-dm-sans)", "sans-serif"],
        "nunito": ["var(--font-nunito)", "sans-serif"],
      },
      colors: {
        clay: {
          canvas: "#F4F1FA",
          cardBg: "rgba(255, 255, 255, 0.7)", // Used with backdrop-blur
          foreground: "#332F3A",
          muted: "#635F69",
          accent: "#7C3AED",
          accentAlt: "#DB2777",
          sky: "#0EA5E9",
          success: "#10B981",
          warning: "#F59E0B",
        },
        matrix: {
          bg: "#f3f3eb",
          cardBg: "#f8f8f2",
          border: "#e2e2d8",
          textMuted: "#666660",
          pillIst: "#c8dfc4",
          pillCst: "#cce0ee",
          heat0: "#ecece6",
          heatLow: "#dbeedd",
          heatMed: "#f7eed2",
          heatHigh: "#f7dcdb",
          heatBorder: "#d2dfd0",
        },
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        activeRing: "0 0 0 3px rgba(59, 130, 246, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
