/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Core palette - "Dispatch Console" identity:
        // deep slate ink + electric teal (assistant) + signal amber (call actions)
        ink: {
          950: '#0B0E11',
          900: '#12151A',
          800: '#1B2027',
          700: '#262D36',
          600: '#3A4350',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F4F5F7',
          sunken: '#EAECEF',
        },
        teal: {
          50: '#EAFBF8',
          100: '#CDF5EE',
          400: '#2FC9B8',
          500: '#17B8A6',
          600: '#0E968A',
          700: '#0B7A70',
        },
        signal: {
          50: '#FFF6EC',
          100: '#FFE7CC',
          400: '#FFA351',
          500: '#F5860E',
          600: '#CC6E0A',
        },
        danger: {
          500: '#DC2626',
          600: '#B91C1C',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,14,17,0.04), 0 8px 24px -8px rgba(11,14,17,0.08)',
        panel: '0 2px 8px rgba(11,14,17,0.06), 0 24px 48px -24px rgba(11,14,17,0.18)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      animation: {
        'pulse-dot': 'pulse-dot 1.4s ease-in-out infinite',
        'slide-up': 'slide-up 0.25s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.4' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
