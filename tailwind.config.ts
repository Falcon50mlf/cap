import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        night: {
          DEFAULT: 'var(--night)',
          soft: 'var(--night-soft)',
          100: 'var(--night-100)',
          200: 'var(--night-200)',
          500: 'var(--night-500)',
          700: 'var(--night-700)',
        },
        snow: 'var(--snow)',
        sun: 'var(--sun)',
        pivot: 'var(--pivot)',
        coral: 'var(--coral)',
        mint: 'var(--mint)',
        family: {
          strategy: 'var(--family-strategy)',
          finance: 'var(--family-finance)',
          marketing: 'var(--family-marketing)',
          tech: 'var(--family-tech)',
          startup: 'var(--family-startup)',
          retail: 'var(--family-retail)',
        },
        discovery: 'var(--discovery)',
        programs: 'var(--programs)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        lg: '24px',
        md: '16px',
        sm: '8px',
      },
      boxShadow: {
        card: '0 30px 60px rgba(0,0,0,0.4)',
        'glow-sun': '0 0 24px var(--sun), 0 0 48px rgba(255,220,50,0.25)',
        'glow-pivot': '0 0 24px var(--pivot), 0 0 48px rgba(140,110,255,0.25)',
      },
    },
  },
  plugins: [],
};
export default config;
