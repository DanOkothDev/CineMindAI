/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#14120F',
          soft: '#1C1915',
          raised: '#242019',
        },
        paper: {
          DEFAULT: '#F2ECDD',
          dim: '#C9C1AC',
          faint: '#8B8473',
        },
        amber: {
          DEFAULT: '#E8A33D',
          dim: '#B97F26',
          glow: '#F4C878',
        },
        crimson: {
          DEFAULT: '#C1432B',
          dim: '#8F311F',
        },
        sage: {
          DEFAULT: '#7C9070',
          dim: '#5C6B53',
        },
        slate: {
          DEFAULT: '#2A2723',
          line: '#352F27',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 0 rgba(242,236,221,0.04) inset, 0 12px 24px -16px rgba(0,0,0,0.6)',
        glow: '0 0 0 1px rgba(232,163,61,0.35), 0 0 24px -4px rgba(232,163,61,0.45)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        reel: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.35s ease-out both',
        reel: 'reel 1.4s linear infinite',
      },
    },
  },
  plugins: [],
}
