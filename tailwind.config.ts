import { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        textGlow: {
          '0%, 100%': { textShadow: '0 0 8px rgba(255, 255, 255, 0.5)' },
          '50%': { textShadow: '0 0 16px rgba(255, 255, 255, 1)' },
        },
        coinFlip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(720deg)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-out',
        textGlow: 'textGlow 1.5s infinite alternate',
        coinFlip: 'coinFlip 2s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;