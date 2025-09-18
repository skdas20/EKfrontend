/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfcfb',
          100: '#faf7f0',
          200: '#f5eed9',
          300: '#f0e4c1',
          400: '#ebd3a2',
          500: '#e6c384',
          600: '#d4a855',
          700: '#b8922c',
          800: '#8f6f1c',
          900: '#5d4a12',
        },
        brand: {
          50: '#e8f8ee',
          100: '#d2f1df',
          200: '#a7e4c1',
          300: '#7cd8a4',
          400: '#45cb80',
          500: '#1CB64E',
          600: '#16a247',
          700: '#12853b',
          800: '#0D8F2F',
          900: '#0a6a26',
        },
        accent: {
          50: '#fff3e6',
          100: '#ffe6cc',
          200: '#ffd2a3',
          300: '#ffbd79',
          400: '#FFA22A',
          500: '#FF7F1E',
          600: '#f86a17',
          700: '#EB5C0C',
          800: '#cf4e0a',
          900: '#a93f08',
        },
        mint: {
          400: '#89E1DB',
          500: '#23B3A9',
        },
        white: '#ffffff',
        gray: {
          50: '#f9f9f9',
          100: '#f3f3f3',
          200: '#e7e7e7',
          300: '#dadada',
          400: '#c7c7c7',
          500: '#b3b3b3',
          600: '#999999',
          700: '#7f7f7f',
          800: '#656565',
          900: '#4a4a4a',
        }
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(90deg, #1CB64E, #0D8F2F)',
        'accent-gradient': 'linear-gradient(90deg, #FFA22A, #FF7F1E, #EB5C0C)',
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'soft': '0 1px 0 0 rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
}