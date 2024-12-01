module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: '#1f2937', // Tailwind 기본 색상 확장
        secondary: '#3b82f6',
      },
    },
  },
  plugins: [],
};
