/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: '#2B5FBF',
          dark: '#1E4A9A',
          light: '#4A7FD4',
          pale: '#D6E4F7',
        },
        gold: {
          DEFAULT: '#F5C842',
          dark: '#C49A1A',
        },
        offWhite: '#F4F6FB',
        ink: '#1A2A4A',
        muted: '#6B7FA3',
        border: '#D6E4F7',
        green: '#2ECC71',
        red: '#E74C3C',
        slate: {
          50: '#F8FAFC',
          200: '#E2E8F0',
          300: '#CBD5E1',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          900: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
    },
  },
  presets: [require('nativewind/preset')],
  plugins: [],
};
