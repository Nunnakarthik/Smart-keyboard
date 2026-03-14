/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tribal-primary': '#1e293b',
        'tribal-accent': '#6366f1',
      }
    },
  },
  plugins: [],
}
