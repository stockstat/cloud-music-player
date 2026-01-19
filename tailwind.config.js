/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/renderer/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern theme colors
        'app-bg': '#0f0f1a',
        'app-surface': '#1a1a2e',
        'app-surface-light': '#252542',
        'app-accent': '#6366f1',
        'app-accent-hover': '#818cf8',
        'app-text': '#e2e8f0',
        'app-text-muted': '#94a3b8',

        // Winamp theme colors
        'winamp-bg': '#232323',
        'winamp-dark': '#0a0a0a',
        'winamp-green': '#00ff00',
        'winamp-green-dim': '#00aa00',
        'winamp-blue': '#0066cc',
        'winamp-highlight': '#4a4a6a',
      },
      fontFamily: {
        'winamp': ['"Press Start 2P"', 'monospace'],
        'lcd': ['Consolas', 'Monaco', 'monospace'],
      },
    },
  },
  plugins: [],
}
