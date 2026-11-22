/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        ink: {
          DEFAULT: '#1f242d',
          soft: '#323946',
          deep: '#0e1022',
        },
        neon: {
          DEFAULT: '#00eeff',
          soft: '#4f8cff',
        },
      },
    },
  },
  plugins: [],
};
