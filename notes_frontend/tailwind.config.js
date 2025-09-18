/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#F59E0B',
        success: '#F59E0B',
        error: '#EF4444',
        'ocean-blue': '#2563EB',
        'ocean-amber': '#F59E0B',
        'ocean-background': '#f9fafb',
        'ocean-surface': '#ffffff',
        'ocean-text': '#111827'
      }
    },
  },
  plugins: [],
}
