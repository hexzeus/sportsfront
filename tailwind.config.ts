import { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}', // Adjust these paths based on your project structure
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
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-out',
        textGlow: 'textGlow 1.5s infinite alternate',
      },
    },
  },
  plugins: [],
};

export default config;
