/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      xs: '320px',
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1024px',
      xxl: '1280px',
    },
    extend: {
      fontFamily: {
        xmas: ['Mountains of Christmas', 'serif'],
        fig: ['Figtree', 'sans-serif'],
      },
      colors: {
        xmasBrightRed: '#FF0000',
        xmasRed: '#BA0C0C',
        xmasDarkRed: '#751717',
        xmasDarkestRed: '#5C0000',
        xmasGrey: '#FFEBEB',
        xmasWhite: '#ECFFEB',
        xmasBrightGreen: '#27A300',
        xmasGreen: '#2A850E',
        xmasDarkGreen: '#2D661B',
        xmasDarkestGreen: '#005C00',
      }
    },
  },
  plugins: [],
}

