/** Colors come from one place: src/styles/theme.ts mirrors these tokens. */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        milk: "#FFF7FB",
        lilac: "#CDB8F5",
        mint: "#BFEBD7",
        bubblegum: "#FFB3D1",
        butter: "#FFE9A8",
        ink: "#2B2340",
        clear: "#7c7fbb43",
        red: "#c24141",
      },
      fontFamily: {
        pixel: ['"Bitcount"', "ui-monospace", "monospace"],
        body: ["Nunito", "system-ui", "sans-serif"],
      },
      borderRadius: { win: "14px" },
    },
  },
  plugins: [],
};
