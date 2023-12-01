import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    container: {
      center: true,
    },
  },
  plugins: [require('@tailwindcss/typography'),require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "night", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "nord", "emerald"], 
  },
}
