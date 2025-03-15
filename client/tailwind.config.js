/** @type {import('tailwindcss').Config} */
import { heroui } from "@heroui/react";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        fustat: ['"Fustat"', "sans-serif"],
        figtree: ['"Figtree"', "sans-serif"],
      },
    },
  },
  plugins: [heroui()],
};
