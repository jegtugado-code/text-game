/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/daisyui/dist/**/*.js',
    // removed react-daisyui since we're using plain daisyui classes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
