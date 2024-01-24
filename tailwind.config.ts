import { type Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
    colors: {
      'green-opacity': 'rgba(19, 190, 74, 0.5)', // new color with opacity
      'red-opacity': 'rgba(190, 7, 36, 0.5)', // new color with opacity
    }},
    container: {
      center: true,
    },
  },
  plugins: [require('@tailwindcss/typography'),require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "night", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "nord", "emerald"], 
  },
};

export default config;
