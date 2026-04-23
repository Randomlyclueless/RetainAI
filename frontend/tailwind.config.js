/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#D4AF37',
        emerald: '#00FF94',
        danger: '#FF4444',
        warning: '#FFB800',
      },
      fontFamily: {
        serif: ['DM Serif Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        xl: '12px',
      }
    },
  },
  plugins: [],
}
