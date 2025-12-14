/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brutal-yellow': '#FFDC00',
        'brutal-pink': '#FF6B9D',
        'brutal-blue': '#00D4FF',
        'brutal-green': '#00FF88',
        'brutal-orange': '#FF9500',
        'brutal-purple': '#B76CFD',
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(0,0,0,1)',
        'brutal-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
        'brutal-xl': '12px 12px 0px 0px rgba(0,0,0,1)',
      },
      fontFamily: {
        'display': ['Archivo Black', 'sans-serif'],
        'body': ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
