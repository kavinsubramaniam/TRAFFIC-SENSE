/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#f8fafc",
        card: "#ffffff",
        accent: "#f59e0b",
        ink: "#0f172a",
        muted: "#64748b",
        success: "#15803d",
        danger: "#b91c1c",
        warning: "#b45309"
      },
      fontFamily: {
        sans: ["Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif"]
      },
      boxShadow: {
        panel: "0 10px 30px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};
