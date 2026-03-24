/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glass: {
          bg: "rgba(15, 23, 42, 0.75)",
          border: "rgba(255, 255, 255, 0.05)",
        }
      },
      animation: {
        shimmer: "shimmer 2.2s linear infinite",
        slideUp: "slideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        slideUp: {
          "from": { opacity: 0, transform: "translateY(24px)" },
          "to": { opacity: 1, transform: "translateY(0)" }
        }
      }
    },
  },
  plugins: [],
}
