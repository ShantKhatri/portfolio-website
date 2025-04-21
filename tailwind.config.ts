import type { Config } from "tailwindcss";
import typography from '@tailwindcss/typography';

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [
    typography,
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        blink: 'blink 1s step-end infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      typography: (theme: (path: string) => string) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.300'),
            'h1, h2, h3, h4, h5, h6': {
              color: theme('colors.white'),
              fontWeight: '700',
            },
            a: {
              color: theme('colors.purple.400'),
              '&:hover': {
                color: theme('colors.purple.300'),
              },
            },
            code: {
              color: theme('colors.gray.300'),
              backgroundColor: theme('colors.gray.800'),
              borderRadius: theme('borderRadius.md'),
              padding: '0.2em 0.4em',
            },
            pre: {
              backgroundColor: theme('colors.gray.900'),
            },
            hr: {
              borderColor: theme('colors.gray.700'),
            },
            strong: {
              color: theme('colors.white'),
            },
            blockquote: {
              borderLeftColor: theme('colors.purple.500'),
              color: theme('colors.gray.400'),
            },
          },
        },
      }),
    },
  },
} satisfies Config;
