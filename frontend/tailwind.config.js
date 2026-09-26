/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dream: {
          bg: "#08090D",
          card: "#101421",
          violet: "#27213A",
          glow: "#B7A6FF",
          text: "#E8E5F0",
          muted: "#858292",
          border: "rgba(183, 166, 255, 0.15)",
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(183, 166, 255, 0.15)',
        'glow-md': '0 0 30px rgba(183, 166, 255, 0.25)',
        'glow-lg': '0 0 50px rgba(183, 166, 255, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
