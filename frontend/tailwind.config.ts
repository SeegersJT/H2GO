import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        waterboy: {
          50: '#e0f2fe',
          100: '#b9e6fe',
          200: '#7dd3fc',
          300: '#38bdf8',
          400: '#0ea5e9',
          500: '#0284c7',
          600: '#0066cc',
          700: '#0057b3',
          800: '#004080',
          900: '#002952',
          950: '#001a33',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'water-drop': {
          '0%': {
            transform: 'scale(1)',
            opacity: '0',
          },
          '50%': {
            transform: 'scale(1.2)',
            opacity: '0.5',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'water-drop': 'water-drop 3s ease-in-out infinite',
      },
      backgroundImage: {
        'water-pattern':
          "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAgMzBjMC0xNS4zMTIgNi44NzYtMjMuNjkzIDE1LjA2Ny0zMEMzNC4wNTggOS4yNSAzMCAxNSAzMCAxNXMuMDEgMi41LS4wMTIgNVMzMCAyNSAzMCAzMGMwIDUgMS41NjcgMTAuMzc1IDEwLjczMiAxNS4wNjdDMzYuODI2IDUzLjY5MyAzMCA0NS4zMTMgMzAgMzB6bS0uMDE0LTVjLS4xNTYuMDA0LS4zMTIuMDA0LS40NjkuMDA0QzE0LjE3NSAyNSA1IDEzLjQzNyA1IC4wMDVjMCAwIC40NzUuMjczIDEuMjI5LjY1NUM1LjQ1IDE1LjI1IDE1IDI5LjI4MiAyOS41MjEgMjQuOTk2eiIgZmlsbD0icmdiYSgxNCwxNjUsMjMzLDAuMDMpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')",
      },
    },
  },
  plugins: [tailwindcssAnimate],
}

export default config
