/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",        // Tells Tailwind to scan the index.html file for class names
    "./src/**/*.{js,ts,jsx,tsx}",  // Tells Tailwind to scan all .js, .ts, .jsx, .tsx files in the src folder
  ],
  theme: {
    extend: {
      colors: {
        netflixRed: '#E50914',  // Add custom red color for Netflix theme
      },
    },
  },
  plugins: [],
}