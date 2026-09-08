/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        arena: {
          bg: '#080b11',
          panel: '#0e131f',
          card: '#131929',
          cardHover: '#192238',
          border: '#1e2638',
          borderGlow: '#2e3a54',
          muted: '#64748b',
          text: '#f8fafc',
        },
        player: {
          DEFAULT: '#22d3ee',
          dark: '#0891b2',
          light: '#67e8f9',
          glow: 'rgba(34, 211, 238, 0.45)',
        },
        opponent: {
          DEFAULT: '#fb7185',
          dark: '#e11d48',
          light: '#fda4af',
          glow: 'rgba(251, 113, 133, 0.45)',
        },
        rank: {
          bronze: '#cd7f32',
          silver: '#94a3b8',
          gold: '#fbbf24',
          platinum: '#38bdf8',
          diamond: '#c084fc',
          grandmaster: '#f43f5e',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace', 'ui-monospace', 'SFMono-Regular'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      animation: {
        'pulse-glow-cyan': 'pulseCyan 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-glow-orange': 'pulseOrange 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 3s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'glitch': 'glitch 0.3s ease-in-out',
        'slide-in-left': 'slideInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'matrix-ticking': 'matrixTicking 0.8s ease-in-out infinite alternate',
      },
      keyframes: {
        pulseCyan: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(34, 211, 238, 0.4), inset 0 0 15px rgba(34, 211, 238, 0.1)' },
          '50%': { boxShadow: '0 0 30px rgba(34, 211, 238, 0.7), inset 0 0 25px rgba(34, 211, 238, 0.25)' },
        },
        pulseOrange: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(251, 113, 133, 0.4), inset 0 0 15px rgba(251, 113, 133, 0.1)' },
          '50%': { boxShadow: '0 0 30px rgba(251, 113, 133, 0.7), inset 0 0 25px rgba(251, 113, 133, 0.25)' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
