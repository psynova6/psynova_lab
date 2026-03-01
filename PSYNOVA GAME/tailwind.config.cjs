/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
    theme: {
        extend: {
            /* ─── Brand tokens ─── */
            colors: {
                brand: {
                    bg: '#0f121a',
                    surface: '#1a1e28',
                    card: '#222736',
                    border: 'rgba(255,255,255,0.06)',
                    accent: '#2dd4bf',          // teal-400
                    accentAlt: '#10b981',          // emerald-500
                    glow: 'rgba(45,212,191,0.25)',
                    easy: '#4ade80',
                    medium: '#fbbf24',
                    hard: '#f87171',
                    text: '#e2e8f0',
                    muted: '#94a3b8',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                'brand-hero': ['2.75rem', { lineHeight: '1.15', fontWeight: '700' }],
                'brand-sub': ['0.95rem', { lineHeight: '1.5', fontWeight: '400' }],
            },
            borderRadius: {
                'brand': '1rem',
                'brand-lg': '1.25rem',
            },
            boxShadow: {
                'brand': '0 8px 32px rgba(0,0,0,0.45)',
                'brand-glow': '0 0 24px rgba(45,212,191,0.3)',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'breathe': 'breathe 4s ease-in-out infinite',
            },
            keyframes: {
                breathe: {
                    '0%, 100%': { opacity: '0.4' },
                    '50%': { opacity: '0.7' },
                },
            },
        },
    },
    plugins: [],
};
