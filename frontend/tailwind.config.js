/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        xmas: ['Mountains of Christmas', 'serif'],
        fig: ['Figtree', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

