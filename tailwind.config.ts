import type { Config } from 'tailwindcss'

export default {
  content: ['./components/**/*.vue', './pages/**/*.vue', './layouts/**/*.vue', './app.vue'],
  darkMode: 'media',
  important: true, 
  theme: {
    extend: {},
  },
  plugins: [],
} as Config
