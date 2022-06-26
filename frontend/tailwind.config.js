module.exports = {
  darkMode: "class",
  mode: "jit",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0056DB;",
          50: "#CFE8FC",
          100: "#BCDFFB",
          200: "#95CDF9",
          300: "#6EBBF7",
          400: "#48A8F5",
          500: "#3b82f6",
          600: "#0B79D1",
          700: "#085A9B",
          800: "#063B66",
          900: "#031C31",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
