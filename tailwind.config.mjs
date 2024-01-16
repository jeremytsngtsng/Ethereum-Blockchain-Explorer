/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.{mjs,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        light: '0 0.5rem 1.2rem rgba(82, 85, 92, 0.3)'
      }
    },
  },
  plugins: []
}
