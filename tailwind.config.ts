import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ash: {
          50: '#fdf4f3',
          100: '#fbe8e6',
          200: '#f7d5d0',
          300: '#f0b4ab',
          400: '#e58576',
          500: '#d75d4b',
          600: '#c24230',
          700: '#a33324',
          800: '#872d21',
          900: '#702b21',
          950: '#3d120c',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
};
export default config;

