const colors = require('tailwindcss/colors');

module.exports = {
  purge: {
    content: ['./public/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    safelist: ['border-blue-500'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        rose: colors.rose,
        blue: {
          100: '#E2ECFE',
          200: '#C5D9FE',
          300: '#A7C6FD',
          400: '#8AB3FD',
          500: '#6DA0FC',
          600: '#6492E7',
          700: '#486AA7',
          800: '#364E7C',
          900: '#2D4167',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'), require('@tailwindcss/aspect-ratio')],
};
