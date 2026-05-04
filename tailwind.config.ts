import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: '#f7f1ea',
        surface: '#fffaf3',
        ink: '#20160f',
        muted: '#6f5f53',
        accent: '#d97706',
        accentSoft: '#fef3c7',
        border: 'rgba(32, 22, 15, 0.12)',
      },
      boxShadow: {
        soft: '0 20px 60px rgba(32, 22, 15, 0.12)',
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(circle at top left, rgba(217,119,6,0.22), transparent 38%), radial-gradient(circle at right, rgba(120,53,15,0.16), transparent 36%)',
      },
    },
  },
  plugins: [],
};

export default config;