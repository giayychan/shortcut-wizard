// const colors = require('tailwindcss/colors');
module.exports = {
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'off-white': '#fffff4',
        steam: '#dddddd',
        squant: '#666666',
        'chromaphobic-black': '#292929',
        'dynamic-black': '#1d1d1d',
        raven: '#0b0b0b',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
