/** @type {import('tailwindcss').Config} */
export default {
  // Toggle dark mode by adding/removing `dark` on <html>. The theme
  // toggle flips this one class; we default the app to dark.
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Semantic tokens so components never hardcode hex values.
        // Wired to CSS variables (see index.css) so dark/light just swaps the vars.
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--color-surface-2) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        content: 'rgb(var(--color-content) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        brand: 'rgb(var(--color-brand) / <alpha-value>)',
        'brand-strong': 'rgb(var(--color-brand-strong) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        danger: 'rgb(var(--color-danger) / <alpha-value>)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
