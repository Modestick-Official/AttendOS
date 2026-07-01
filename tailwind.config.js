/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        display: ['var(--font-display)', 'sans-serif'],
      },
      spacing: {
        68: '17rem',
        85: '21.25rem',
      },
      colors: {
        slate: {
          850: '#0f172a',
          950: '#030712',
        },
      },
      backdropBlur: {
        md: '12px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(16, 185, 129, 0.5)',
      },
    },
  },
  plugins: [],
};
