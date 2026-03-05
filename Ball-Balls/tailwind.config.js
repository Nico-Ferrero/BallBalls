/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Ball&Balls Official Palette
        'imperial-red': '#E63946',
        'honeydew': '#F1FAEE',
        'powder-blue': '#A8DADC',
        'cerulean': '#457B9D',
        'prussian-blue': '#1D3557',
        // Dark mode variants
        'deep-dark-blue': '#0F1C2E',
        'light-red': '#EF5350',
        'soft-cerulean': '#6798B5',
        'muted-blue': '#3A5A78',
      },
      textColor: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
        'accent-primary': 'var(--accent-primary)',
        'accent-secondary': 'var(--accent-secondary)',
      },
      backgroundColor: {
        primary: 'var(--bg-primary)',
        secondary: 'var(--bg-secondary)',
        tertiary: 'var(--bg-tertiary)',
        card: 'var(--bg-card)',
        'accent-primary': 'var(--accent-primary)',
        'accent-secondary': 'var(--accent-secondary)',
      },
      borderColor: {
        'border-color': 'var(--border-color)',
        'accent-primary': 'var(--accent-primary)',
        'accent-secondary': 'var(--accent-secondary)',
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': '0.75rem',   // 12px
        'sm': '0.875rem',  // 14px
        'base': '1rem',    // 16px
        'lg': '1.125rem',  // 18px
        'xl': '1.25rem',   // 20px
        '2xl': '1.5rem',   // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem',  // 36px
        '5xl': '3rem',     // 48px
      },
      borderRadius: {
        'pill': '999px',
      },
      boxShadow: {
        'light': '0 4px 12px rgba(29, 53, 87, 0.08)',
        'dark': '0 4px 12px rgba(0, 0, 0, 0.4)',
      },
      transitionDuration: {
        'default': '200ms',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate')
  ],
}
