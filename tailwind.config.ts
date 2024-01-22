import { type Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
    colors: {
      'green-opacity': 'rgba(19, 78, 74, 0.222)', // new color with opacity
      'red-opacity': 'rgba(80, 7, 36, 0.1)', // new color with opacity
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
