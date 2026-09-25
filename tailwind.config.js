/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        chakra: ['"Chakra Petch"', 'sans-serif'],
        fredoka: ['Fredoka', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      colors: {
        navy: '#0D2B52',
        cobalt: '#1769C2',
        sky: '#58B7F2',
      },
    },
  },
  plugins: [],
};
