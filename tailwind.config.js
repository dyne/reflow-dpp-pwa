const konstaConfig = require('konsta/config');

module.exports = konstaConfig({
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'page-ios-light': '#fff',
        'primary': {
          light: '#6de498',
          DEFAULT: '#4ADE80',
          dark: '#27d868',
        }
      },
      fontFamily: {
        dyne: ['Syne', 'sans-serif'],
      }
    },
  },
  plugins: [],
});
