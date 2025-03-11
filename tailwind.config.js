/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        secondary:'#1C1C1C',
        primary:'#181818',
        tertiary: '#312EB5',
        blackLight: '#FFFFFF0D'
      }
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
}

