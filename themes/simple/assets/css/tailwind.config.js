const colors = require('tailwindcss/colors');

module.exports = {
  enabled: true,
  darkMode: 'class',
  purge: [
    './layouts/**/*.html',
    './layouts/*.html',
    './themes/simple/layouts/**/*.html',
    './themes/simple/layouts/*.html',
    './content/*.md',
    './content/**/*.md',
  ],
  theme: {
    container: {
      center: false,
    },
    extend: {
      fontFamily: {
        inter: ['InterVariable', 'sans-serif'],
      },
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/typography')],
};
