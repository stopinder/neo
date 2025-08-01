export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./**/*.vue"  // 👈 this ensures any stray Vue files are picked up
  ],

  theme: {
    extend: {
      colors: {
        navy: '#1e2a3a',
        periwinkle: '#a3bffa',
        'sky-soft': '#cddffb',
        'space-gray': '#2f3e58',
        'star-glow': '#f0f8ff',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        aura: '0 8px 24px rgba(163, 191, 250, 0.4)',
        glow: '0 0 20px rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'stars': "url('/assets/stars-bg.svg')",
      },
      animation: {
        fadeIn: 'fadeIn 2s ease-in forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
