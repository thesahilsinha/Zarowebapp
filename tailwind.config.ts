import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#fef6f1",
          100: "#fde8d8",
          200: "#fbc9a8",
          300: "#f7a06e",
          400: "#f28048",
          500: "#EA6D3A",
          600: "#d45a27",
          700: "#b04720",
          800: "#8c381c",
          900: "#72301a",
        },
        forest: {
          50:  "#f0f4f2",
          100: "#d6e3dd",
          200: "#adc7bb",
          300: "#7da898",
          400: "#5a8a7a",
          500: "#3E594E",
          600: "#324a40",
          700: "#293c34",
          800: "#203329",
          900: "#172520",
        },
        cream: {
          50:  "#ffffff",
          100: "#fdfcf9",
          200: "#F8F4ED",
          300: "#f2ead9",
          400: "#ecdfc4",
          500: "#F6DA9D",
          600: "#e8c36a",
          700: "#d4a83a",
          800: "#b08a28",
          900: "#8c6e1e",
        },
        background: "#F8F4ED",
        foreground: "#203329",
        border: "#e8e0d0",
        accent: "#f2ead9",
        "muted-foreground": "#5a7065",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        "3xl": "28px",
      },
      boxShadow: {
        soft: "0 2px 12px rgba(32, 51, 41, 0.06)",
        card: "0 4px 24px rgba(32, 51, 41, 0.08)",
        "card-hover": "0 8px 40px rgba(32, 51, 41, 0.14)",
      },
    },
  },
  plugins: [],
};

export default config;