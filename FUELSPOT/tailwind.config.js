/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'wave': 'wave 15s linear infinite',
        'wave-slow': 'wave 20s linear infinite',
        'bubble-rise': 'bubble-rise 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'gas-pump': 'gas-pump 3s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%': { transform: 'translateX(0) scaleY(1)' },
          '50%': { transform: 'translateX(-25%) scaleY(0.8)' },
          '100%': { transform: 'translateX(-50%) scaleY(1)' },
        },
        'bubble-rise': {
          '0%': { transform: 'translateY(100vh) scale(0)', opacity: 0 },
          '50%': { opacity: 0.5 },
          '100%': { transform: 'translateY(-20vh) scale(1.5)', opacity: 0 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        'gas-pump': {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '50%': { transform: 'scale(1.05) rotate(-2deg)' },
        }
      }
    },
  },
  plugins: [],
}
