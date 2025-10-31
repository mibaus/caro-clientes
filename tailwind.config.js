/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Poppins', 'Nunito', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Paleta coral durazno suave
        terracotta: {
          50: '#fff5f4',
          100: '#ffe8e6',
          200: '#ffd1cd',
          300: '#ffb3ab',
          400: '#ff9b91',
          500: '#ff8a80',
          600: '#ff6b6b',
          700: '#e55555',
          800: '#cc4040',
          900: '#b22d2d',
        },
        // Paleta lavanda/púrpura suave para acentos
        lavender: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        // Tonos peach/crema cálidos
        peach: {
          50: '#fef8f3',
          100: '#fef0e6',
          200: '#fde2cc',
          300: '#fbc9a3',
          400: '#f9a870',
          500: '#f58b45',
          600: '#e6742a',
          700: '#c25d20',
          800: '#9a4b20',
          900: '#7c401e',
        },
      },
    },
  },
  plugins: [],
};
