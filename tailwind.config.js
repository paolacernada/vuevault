/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",                    // Path to the main HTML file
    "./src/**/*.{vue,js,ts,jsx,tsx}",  // Glob pattern to include all Vue, JavaScript, TypeScript, JSX, and TSX files in the src directory
  ],
  // Extend the default Tailwind theme
  theme: {
    extend: {
      // Custom color palette added to the default Tailwind colors
      colors: {
        'light-blue': '#ebf8ff',
        'dark-blue': '#2563eb',
        'darker-blue': '#1d4ed8',
        'deepest-blue': '#1e40af',
        'light-gray-2': '#d1d5db',
        'soft-orange': '#ffcb6b',
        'light-pink': '#fecaca',
      },
      // Custom font family
      fontFamily: {
        shrikhand: ['Shrikhand', 'serif'], // Adding 'Shrikhand' font with serif fallback
      },
    },
  },
  // Including Tailwind CSS plugins
  plugins: [
    require('@tailwindcss/forms'), // Plugin for styling forms
  ],
}
