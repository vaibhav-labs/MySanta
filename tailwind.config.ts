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
        sans:    ['"DM Sans"', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        primary:   { DEFAULT: '#0D0D0D' },
        secondary: { DEFAULT: '#E8E8E8' },
        surface:   { DEFAULT: '#F7F7F5' },
        hover:     { DEFAULT: '#F0F0EE' },
        ink:       { DEFAULT: '#0D0D0D' },
        chalk:     { DEFAULT: '#FFFFFF' },
        brand: {
          DEFAULT: '#FF5C3A',   // electric coral — Gen Z, not fashion-brand yellow
          dark:    '#E04A2B',
          light:   '#FFF0EC',
        },
      },
      boxShadow: {
        card:        '0 1px 4px rgba(0,0,0,0.06)',
        'card-hover':'0 8px 24px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
}
export default config
