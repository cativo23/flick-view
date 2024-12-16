/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        'tokyo-night': {
          bg: '#1a1b26',
          'bg-lighter': '#24283b',
          text: '#a9b1d6',
          'text-muted': '#787c99',
          accent: '#7aa2f7',
          'accent-hover': '#2ac3de',
          border: '#414868',
          red: '#f7768e',
        },
      },
    },
  },
  plugins: [],
}

