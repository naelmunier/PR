/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#e30613',
          hover:   '#c0040f',
          clair:   '#ff4d57',
          50:  '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
        },
        ink: {
          DEFAULT: '#0a0a0f',
          2: '#374151',
          3: '#6b7280',
          4: '#9ca3af',
        },
        bg: {
          DEFAULT: '#ffffff',
          subtle:  '#fafafa',
        },
        surface: '#ffffff',
        border: {
          DEFAULT: '#f0e8e8',
          med:     '#e5d5d5',
        },
        navy: '#1b2a4a',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans:    ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
