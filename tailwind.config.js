/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111827',
        slate: '#64748B',
        border: '#E2E8F0',
        canvas: '#F8FAFC',
      },
    },
  },
  presets: [require('nativewind/preset')],
  plugins: [],
};
