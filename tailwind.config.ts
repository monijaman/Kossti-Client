import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // KOSSTI Earth Tone Design System
        kossti: {
          // Primary: Dark Brown (Charcoal/Dark Bread)
          dark: "#3d2817",
          "dark-light": "#5a3d2e",

          // Secondary: Rich Brown (Medium Bread)
          brown: "#8b6f47",
          "brown-light": "#a0845e",

          // Accent: Warm Tan/Wheat
          tan: "#d4a574",
          "tan-light": "#e8c9a0",

          // Light: Cream/Beige
          cream: "#f5e6d3",
          "cream-light": "#faf7f2",

          // Supporting colors
          gold: "#c9a961",
          "gold-light": "#e5c896",
          black: "#2b2b2b",
        },
      },
      animation: {
        'blob': 'blob 7s infinite',
        'top-loading-bar': 'top-loading-bar 1.1s ease-in-out infinite',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        'top-loading-bar': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(300%)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
