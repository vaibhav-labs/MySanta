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
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        // Base
        primary:   { DEFAULT: '#0F0B1A' },
        secondary: { DEFAULT: '#E5E7EB' },
        surface:   { DEFAULT: '#F8F7FF' },
        hover:     { DEFAULT: '#F3F0FF' },
        // Electric brand palette
        brand: {
          DEFAULT:  '#8B5CF6',  // electric purple
          dark:     '#6D28D9',
          light:    '#EDE9FE',
          pink:     '#EC4899',
          cyan:     '#22D3EE',
          green:    '#10B981',
          orange:   '#F97316',
          amber:    '#F59E0B',
        },
        // Dark canvas
        dark: {
          DEFAULT: '#0F0B1A',
          card:    '#1A1330',
          border:  '#2D2450',
        },
      },
      borderRadius: {
        xl:  '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        card:       '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-hover':'0 8px 24px 0 rgba(139,92,246,0.12)',
        glow:       '0 0 30px rgba(139,92,246,0.35)',
        'glow-pink':'0 0 30px rgba(236,72,153,0.35)',
        'glow-cyan':'0 0 30px rgba(34,211,238,0.35)',
        glass:      '0 4px 24px rgba(15,11,26,0.25)',
      },
      backgroundImage: {
        'gradient-electric': 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #22D3EE 100%)',
        'gradient-hero':     'linear-gradient(135deg, #0F0B1A 0%, #1E1040 40%, #2D1B69 100%)',
        'gradient-card':     'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
        'gradient-cyan':     'linear-gradient(135deg, #22D3EE 0%, #8B5CF6 100%)',
        'gradient-warm':     'linear-gradient(135deg, #F97316 0%, #EC4899 100%)',
        'gradient-green':    'linear-gradient(135deg, #10B981 0%, #22D3EE 100%)',
      },
    },
  },
  plugins: [],
}
export default config
