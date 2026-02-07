/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lato: ['Lato', 'sans-serif'],
        rubik: ['Rubik', 'sans-serif'],
      },
      colors: {
        background: '#24212b',
        'card-bg': '#2E2B38',
        'text-primary': '#F5F7FA',
        'text-secondary': '#A0AEC0',
        yellow: '#fafa33',
        purple: '#782e87',
        border: '#4A4A5A',
      },
    },
  },
  plugins: [],
}
