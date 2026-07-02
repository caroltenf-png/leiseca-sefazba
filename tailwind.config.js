/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  // O app legado tem reset próprio embutido; preflight entraria em conflito
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        fundo: "var(--cor-fundo)",
        fundo2: "var(--cor-fundo2)",
        fundo3: "var(--cor-fundo3)",
        verde: "var(--cor-verde)",
        "verde-2": "var(--cor-verde2)",
        "verde-3": "var(--cor-verde3)",
        ambar: "var(--cor-ambar)",
        neutra: "var(--cor-neutra)",
        clara: "var(--cor-clara)",
      },
      fontFamily: {
        titulo: ["'Playfair Display'", "serif"],
        corpo: ["Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
