/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',     
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './node_modules/preline/**/*.js', 
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Cabinet Grotesk"', 'sans-serif'], 
      },
    },
  },
  plugins: [
    require('preline/plugin'),        
  ],
};
