/** @type {import('tailwindcss').Config} */
export default {
  // Important : activation du mode sombre basé sur la classe
  darkMode: 'class',
  
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  
  theme: {
    extend: {
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shine': 'shine 0.8s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shine: {
          '100%': { left: '200%' },
        }
      }
    },
  },
  
  // Correction : Les couleurs doivent être dans theme.extend, pas directement dans theme
  // Déplacé à l'intérieur de extend
  // colors: {
  //   primary: {
  //     50: '#f0f9ff',
  //     100: '#e0f2fe',
  //     200: '#bae6fd',
  //     300: '#7dd3fc',
  //     400: '#38bdf8',
  //     500: '#0ea5e9',
  //     600: '#0284c7',
  //     700: '#0369a1',
  //     800: '#075985',
  //     900: '#0c4a6e',
  //   },
  //   secondary: {
  //     50: '#fefce8',
  //     100: '#fef9c3',
  //     200: '#fef08a',
  //     300: '#fde047',
  //     400: '#facc15',
  //     500: '#eab308',
  //     600: '#ca8a04',
  //     700: '#a16207',
  //     800: '#854d0e',
  //     900: '#713f12',
  //   },
  // },
  
  plugins: [require("daisyui")],
  
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
    ],
    // Optionnel : définir le thème par défaut
    defaultTheme: "light",
    // Optionnel : respecter la préférence système
    respectPrefersColorScheme: true,
  },
}