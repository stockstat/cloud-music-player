/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/renderer/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern bright theme colors
        'app-bg': '#f8fafc',
        'app-surface': '#ffffff',
        'app-surface-light': '#f1f5f9',
        'app-surface-dark': '#e2e8f0',
        'app-accent': '#6366f1',
        'app-accent-hover': '#4f46e5',
        'app-accent-light': '#eef2ff',
        'app-text': '#1e293b',
        'app-text-muted': '#64748b',
        'app-text-light': '#94a3b8',
        'app-border': '#e2e8f0',
        'app-border-dark': '#cbd5e1',

        // Player bar (slightly darker for contrast)
        'player-bg': '#1e293b',
        'player-text': '#f8fafc',
        'player-muted': '#94a3b8',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
