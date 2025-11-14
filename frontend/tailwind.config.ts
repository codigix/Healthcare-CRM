import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#1a1a1a',
        'dark-secondary': '#2d2d2d',
        'dark-tertiary': '#3f3f3f',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
export default config
