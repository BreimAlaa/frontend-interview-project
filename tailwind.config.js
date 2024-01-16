/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    screens: {
      'sm': '576px',
      'md': '960px',
      'lg': '1440px',
      'xl': '1920px',

    },
    extend: {},
  },
  plugins: [],
}

