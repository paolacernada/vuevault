/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
            colors: {
        'light-blue': '#ebf8ff',
        'dark-blue': '#2563eb',
        'darker-blue': '#1d4ed8',
        'deepest-blue': '#1e40af',
        'light-gray-2': '#d1d5db',
        'soft-orange': '#ffcb6b',
        'light-pink': '#fecaca',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

