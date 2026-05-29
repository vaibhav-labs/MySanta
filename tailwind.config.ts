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
        surface:   { DEFAULT: '#F8F7FF' },
        hover:     { DEFAULT: '#F0EEFF' },
        ink:       { DEFAULT: '#0D0D0D' },
        chalk:     { DEFAULT: '#FFFFFF' },
        brand: {
          DEFAULT: '#7C3AED',   // deep electric purple — Gen Alpha primary
          dark:    '#6D28D9',
          light:   '#EDE9FE',
          yellow:  '#FFD600',   // punchy yellow accent
          coral:   '#FF5C3A',   // coral pop
          pink:    '#EC4899',   // hot pink
          cyan:    '#06B6D4',   // electric cyan
        },
      },
      boxShadow: {
        card:        '0 1px 4px rgba(0,0,0,0.06)',
        'card-hover':'0 8px 24px rgba(124,58,237,0.12)',
        glow:        '0 0 40px rgba(124,58,237,0.3)',
      },
    },
  },
  plugins: [],
}
export default config
