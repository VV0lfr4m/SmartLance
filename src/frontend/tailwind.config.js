export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],  // Ensure Tailwind scans all files
  theme: {
    extend: {
      keyframes: {
        "infinite-scroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },  // Adjust for smooth loop
        },
      },
      animation: {
        "infinite-scroll": "infinite-scroll 20s linear infinite ",
      },
    },
  },
  plugins: [],
};
