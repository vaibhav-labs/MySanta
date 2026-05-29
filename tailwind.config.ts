import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
      },
      colors: {
        primary:   { DEFAULT: '#0D0D0D' },
        secondary: { DEFAULT: '#E5E5E5' },
        surface:   { DEFAULT: '#F5F5F5' },
        hover:     { DEFAULT: '#F0F0F0' },
        brand: {
          DEFAULT: '#FFD600',
          dark:    '#E6C200',
          light:   '#FFF8CC',
        },
        ink:  { DEFAULT: '#0D0D0D' },
        chalk:{ DEFAULT: '#FFFFFF' },
      },
      letterSpacing: {
        tightest: '-0.04em',
        widest2:  '0.15em',
      },
      boxShadow: {
        card:        '0 1px 3px rgba(0,0,0,0.08)',
        'card-hover':'0 6px 20px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}
export default config
