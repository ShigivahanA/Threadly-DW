/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        handwriting: ['Dancing Script', 'cursive'],
        playful: ['Quicksand', 'sans-serif'],
        decorative: ['Bitcount Prop Double Ink', 'cursive']
      }
    }
  },
  plugins: []
}
