import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        board: {
          bg: 'var(--board-bg)',
          cell: 'var(--board-cell)',
          border: 'var(--board-border)',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
