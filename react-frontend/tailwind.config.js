/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure this covers your React components
    "./public/index.html"        // If you use classes directly in index.html
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}