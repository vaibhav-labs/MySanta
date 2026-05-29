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
        display: ['"Barlow Condensed"', 'sans-serif'],
      },
      colors: {
        primary:   { DEFAULT: '#0D0D0D' },
        secondary: { DEFAULT: '#E8E8E8' },
        surface:   { DEFAULT: '#F5F5F5' },
        hover:     { DEFAULT: '#F0F0F0' },
        ink:       { DEFAULT: '#0D0D0D' },
        brand: {
          DEFAULT: '#FFD600',   // yellow — primary energy
          dark:    '#E6C200',
          light:   '#FFF8CC',
          red:     '#E63946',   // cool brick red — secondary energy
          'red-light': '#FEE2E4',
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
