import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // MegaETH Color Palette
        border: "#19191a",
        input: "#e1dede",
        ring: "#f380cd",
        background: "#dfd9d9",
        foreground: "#19191a",
        primary: {
          DEFAULT: "#19191a",
          foreground: "#dfd9d9",
        },
        secondary: {
          DEFAULT: "#058d5e",
          foreground: "#dfd9d9",
        },
        destructive: {
          DEFAULT: "#b21840",
          foreground: "#dfd9d9",
        },
        muted: {
          DEFAULT: "#e1dede",
          foreground: "#666",
        },
        accent: {
          DEFAULT: "#f380cd",
          foreground: "#19191a",
        },
        popover: {
          DEFAULT: "#ebe8e8",
          foreground: "#19191a",
        },
        card: {
          DEFAULT: "#e0e0e0",
          foreground: "#19191a",
        },
        // MegaETH specific colors
        pink: "#f380cd",
        green: "#058d5e",
        red: "#b21840",
        gray: {
          50: "#ebe8e8",
          100: "#e1dede",
          200: "#dfd9d8",
          300: "#999",
          400: "#848484",
          500: "#666",
          600: "#555",
          700: "#444",
          800: "#19191a",
          900: "#19191a",
        },
      },
      borderRadius: {
        lg: "0px", // Brutalist - no rounding
        md: "0px",
        sm: "0px",
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Courier New', 'Courier', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.2', fontWeight: '700' }],
        'sm': ['0.875rem', { lineHeight: '1.3', fontWeight: '700' }],
        'base': ['1rem', { lineHeight: '1.4', fontWeight: '600' }],
        'lg': ['1.125rem', { lineHeight: '1.4', fontWeight: '700' }],
        'xl': ['1.25rem', { lineHeight: '1.3', fontWeight: '800' }],
        '2xl': ['1.5rem', { lineHeight: '1.2', fontWeight: '900' }],
        '3xl': ['1.875rem', { lineHeight: '1.1', fontWeight: '900' }],
        '4xl': ['2.25rem', { lineHeight: '1', fontWeight: '900' }],
        '5xl': ['3rem', { lineHeight: '1', fontWeight: '900' }],
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #19191a',
        'brutal-sm': '2px 2px 0px 0px #19191a',
        'brutal-lg': '6px 6px 0px 0px #19191a',
        'brutal-xl': '8px 8px 0px 0px #19191a',
      },
      keyframes: {
        "slide-in": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "pop-in": {
          from: { transform: "scale(0.95)" },
          to: { transform: "scale(1)" },
        },
      },
      animation: {
        "slide-in": "slide-in 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "pop-in": "pop-in 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
