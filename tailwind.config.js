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
        // Paleta cálida con naranja oscuro como acento
        terracotta: {
          50: '#fdf8f6',
          100: '#f9ede7',
          200: '#f2d8cb',
          300: '#e8bca3',
          400: '#dc9871',
          500: '#d17748',
          600: '#c05a2e',
          700: '#a14826',
          800: '#843c23',
          900: '#6c3421',
        },
        // Mantener lavender por compatibilidad (mapeado a terracotta)
        lavender: {
          50: '#fdf8f6',
          100: '#f9ede7',
          200: '#f2d8cb',
          300: '#e8bca3',
          400: '#dc9871',
          500: '#d17748',
          600: '#c05a2e',
          700: '#a14826',
          800: '#843c23',
          900: '#6c3421',
        },
      },
    },
  },
  plugins: [],
};
