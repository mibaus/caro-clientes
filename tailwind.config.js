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
        lavender: {
          50: '#faf8ff',
          100: '#f3f0ff',
          200: '#e9e3ff',
          300: '#d4c7ff',
          400: '#b69fff',
          500: '#9b7eff',
          600: '#8257ff',
          700: '#7043f5',
          800: '#5d38d0',
          900: '#4d2fa8',
        },
      },
    },
  },
  plugins: [],
};
