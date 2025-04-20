/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Fresh color palette
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        secondary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        // Fresh accent color - teal
        accent: {
          50: '#effcfa',
          100: '#d7f7f2',
          200: '#b0efe7',
          300: '#7de5d7',
          400: '#43d1c0',
          500: '#25b6a6',
          600: '#1b9288',
          700: '#1a756e',
          800: '#195d59',
          900: '#184d4a',
        },
        // Secondary accent - soft coral
        coral: {
          50: '#fff5f2',
          100: '#ffe8e1',
          200: '#ffd0c7',
          300: '#ffb4a2',
          400: '#fe8c72',
          500: '#f9654c',
          600: '#e64630',
          700: '#c23420',
          800: '#a12e1d',
          900: '#832a1d',
        }
      },
      // Adjust default font sizes to be slightly larger
      fontSize: {
        xs: ['0.813rem', { lineHeight: '1.1rem' }],
        sm: ['0.938rem', { lineHeight: '1.35rem' }],
        base: ['1.063rem', { lineHeight: '1.6rem' }],
        lg: ['1.188rem', { lineHeight: '1.75rem' }],
        xl: ['1.313rem', { lineHeight: '1.9rem' }],
        '2xl': ['1.563rem', { lineHeight: '2.1rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.3rem' }],
      },
      // Increase default spacing
      spacing: {
        '0.5': '0.156rem',
        '1': '0.313rem',
        '1.5': '0.469rem',
        '2': '0.625rem',
        '2.5': '0.781rem',
        '3': '0.938rem',
        '3.5': '1.094rem',
        '4': '1.25rem',
        '5': '1.563rem',
        '6': '1.875rem',
        '7': '2.188rem',
        '8': '2.5rem',
        '9': '2.813rem',
        '10': '3.125rem',
        '11': '3.438rem',
        '12': '3.75rem',
      },
    },
  },
  plugins: [],
}