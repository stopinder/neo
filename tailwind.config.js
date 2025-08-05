export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./**/*.vue"
  ],

  theme: {
    extend: {
      colors: {
        navy: '#1e2a3a',
        periwinkle: '#a3bffa',
        'sky-soft': '#cddffb',
        'space-gray': '#2f3e58',
        'star-glow': '#f0f8ff',
        'moon-glow': '#fdfcf9',
        'ether': '#e2d9f3',
        'sun-gold': '#d9af6b',
        'ink-night': '#0d1321',
        'midnight': '#1b1e33',     // ✅ Added
        'celestial': '#3c4a73',    // ✅ Added
        'roseQuartz': '#e0aebb',
      },
      fontFamily: {

        body: ['Inter', 'sans-serif'],
        poetic: ['"EB Garamond"', 'serif'],
      },
      boxShadow: {
        aura: '0 8px 24px rgba(163, 191, 250, 0.4)',
        glow: '0 0 20px rgba(255, 255, 255, 0.1)',
        halo: '0 0 60px rgba(255, 245, 220, 0.1)',
      },
      backgroundImage: {
        'stars': "url('/assets/stars-bg.svg')",
        'paper-texture': "url('/assets/paper-fiber.png')",
      },
      animation: {
        fadeIn: 'fadeIn 2s ease-in forwards',
        slowPulse: 'slowPulse 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slowPulse: {
          '0%, 100%': { opacity: 0.9 },
          '50%': { opacity: 1 },
        },
      },
      typography: (theme) => ({
        celestial: {
          css: {
            color: theme('colors.space-gray'),
            fontFamily: theme('fontFamily.poetic').join(', '),
            h1: { color: theme('colors.navy'), fontWeight: '700' },
            h2: { color: theme('colors.navy'), fontWeight: '600' },
            strong: { color: theme('colors.sun-gold') },
            em: { color: theme('colors.periwinkle') },
            a: { color: theme('colors.sun-gold'), textDecoration: 'none' },
            blockquote: {
              fontStyle: 'italic',
              color: theme('colors.ether'),
              borderLeft: `2px solid ${theme('colors.sun-gold')}`,
              paddingLeft: theme('spacing.4'),
            },
          },
        },
      }),
    },
  },

  plugins: [
    require('@tailwindcss/typography'),
  ],
}
