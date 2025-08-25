/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#2C0F12',
          medium: '#6B1E23',
          light: '#681E23',
          50: '#FDF2F2',
          100: '#FCE7E7',
          200: '#F9D3D3',
          300: '#F4B3B3',
          400: '#EC8A8A',
          500: '#E15A5A',
          600: '#D12F2F',
          700: '#B01F1F',
          800: '#921B1B',
          900: '#7A1A1A',
        },
        accent: {
          light: '#FEF3C7',
          DEFAULT: '#F59E0B',
          dark: '#D97706',
        },
        success: {
          light: '#D1FAE5',
          DEFAULT: '#10B981',
          dark: '#059669',
        },
        warning: {
          light: '#FEF3C7',
          DEFAULT: '#F59E0B',
          dark: '#D97706',
        },
        error: {
          light: '#FEE2E2',
          DEFAULT: '#EF4444',
          dark: '#DC2626',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #2C0F12 0%, #6B1E23 50%, #681E23 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #6B1E23 0%, #681E23 100%)',
        'gradient-accent': 'linear-gradient(135deg, #2C0F12 0%, #6B1E23 100%)',
        'gradient-radial': 'radial-gradient(ellipse at center, #6B1E23 0%, #2C0F12 100%)',
      },
      boxShadow: {
        'primary': '0 4px 6px rgba(44, 15, 18, 0.25)',
        'primary-lg': '0 8px 32px rgba(44, 15, 18, 0.1)',
        'primary-xl': '0 20px 25px rgba(44, 15, 18, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
} 