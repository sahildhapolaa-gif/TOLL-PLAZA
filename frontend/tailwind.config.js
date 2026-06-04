/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
     fontFamily: {
  display: ['Poppins', 'sans-serif'],
  body: ['Poppins', 'sans-serif'],
  mono: ['Poppins', 'sans-serif'],
},
      colors: {
        toll: {
         colors: {
  toll: {
    bg: '#F5F5F5',
    surface: '#FAFAFA',
    card: '#FFFFFF',
    border: '#E5E7EB',

    accent: '#111111',
    accentDim: '#333333',

    green: '#22C55E',
    red: '#EF4444',
    yellow: '#F59E0B',
    blue: '#3B82F6',

    muted: '#9CA3AF',
    text: '#111827',
    textDim: '#6B7280',
  }}
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.8)' },
        }
      }
    },
  },
  plugins: [],
};
