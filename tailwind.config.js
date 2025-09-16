/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sprinkle-green': '#22c55e',
        'sprinkle-dark': '#111111',
      },
    },
  },
  plugins: [],
}