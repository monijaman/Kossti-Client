import type { Config } from "tailwindcss";

const config: Config = {
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
    },
  },
  plugins: [],
};
export default config;
