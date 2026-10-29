/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#15201a",
        ink2: "#374840",
        muted: "#5a6760",
        line: "#e2e6e0",
        brand: { DEFAULT: "#0a9d64", ink: "#087a4e", soft: "#e3f5ec" },
        amber: { DEFAULT: "#b06a12", soft: "#fbeecf" },
        danger: { DEFAULT: "#c0392b", soft: "#f9ddd9" },
      },
      fontFamily: {
        sans: ["Hanken Grotesk", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
