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
      keyframes: {
        record: {
          '95%, 100%': { transform: 'scale(1.2)', opacity: 0 },
        },
      },
      animation: {
        record: 'record 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
