export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        celestial: '#1e213f',
        starlight: '#dbeafe',
        roseQuartz: '#e2b6b3',
        midnight: '#0b1120',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 10px rgba(219, 234, 254, 0.5)',
      },
    },
  },
  plugins: [],
}
