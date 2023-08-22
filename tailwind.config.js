/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: {
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
      './app/**/*.{js,ts,jsx,tsx}',
    ],
    options: {
      whitelist: [/lazyload/]
    }
  },
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        'cards-pulse': {
          '0%': {
            transform: 'scale(0.94)',
            boxShadow: '0 0 0 0 rgba(161, 158, 159, 0.7)'
          },
          '70%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 12px rgba(224, 201, 207, 0)'
          },
          '100%': {
            transform: 'scale(0.94)',
            boxShadow: '0 0 0 0 rgba(255, 255, 255, 0)'
          }
        }
      },
      animation: {
        'cards-pulse': 'cards-pulse 2s ease infinite'
      }
    },
    screens: {
      'small': '360px',
      // => @media (min-width: 360px) { ... }

      'mobile': '480px',
      // => @media (min-width: 480px) { ... }

      'xs': '576px',
      // => @media (min-width: 576px) { ... }

      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'smd': '660px',
      // => @media (min-width: 660px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'slg': '880px',
      // => @media (min-width: 880px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '1x1': '1350px',
      // => @media (min-width: 1350px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    }
  },
  plugins: [],
}
