import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0a0a0b",
        surface: "#17171a",
        "surface-hover": "#1e1e22",
        border: "#2a2a2e",
        gold: {
          DEFAULT: "#e3a83c",
          soft: "#f0c874",
          dim: "#8a6a2c",
        },
      },
      boxShadow: {
        "gold-glow": "0 0 24px 0 rgba(227, 168, 60, 0.35)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
