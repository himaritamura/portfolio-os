/** Colors come from one place: src/styles/theme.ts mirrors these tokens. */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // milk: "#FFF7FB",
        parchment: "#EFE9E7",
        lilac: "#CDB8F5",
        mint: "#BFEBD7",
        bubblegum: "#FFB3D1",
        butter: "#FFE9A8",
        ink: "#2B2340",
        red: "#c24141",
        lavender: "#dae0f2",
        blueslate: "#3e5c6c",      
      },
      fontFamily: {
        name: ['"Palette Mosaic"', "ui-monospace", "monospace"],
        heading: ["DotGothic16", "ui-monospace", "monospace"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      borderRadius: { win: "14px" },
    },
  },
  plugins: [],
};
