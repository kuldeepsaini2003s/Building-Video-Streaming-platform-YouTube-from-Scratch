module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#fdfdff",
      black: "#000000",
      gray: "#cccccc",
      lightgray: "#f2f2f2",
    },
    extend: {
      screens: {
        ms: "320px",
        // => @media (min-width: 320px) { ... }

        mm: "375px",
        // => @media (min-width: 375px) { ... }

        ml: "425px",
        // => @media (min-width: 425px) { ... }

        sm: "640px",
        // => @media (min-width: 640px) { ... }

        md: "768px",
        // => @media (min-width: 768px) { ... }

        lg: "1024px",
        // => @media (min-width: 1024px) { ... }

        xl: "1280px",
        // => @media (min-width: 1280px) { ... }

        "2xl": "1440px",
        // => @media (min-width: 1440px) { ... }

        "3xl": "1536px",
        // => @media (min-width: 1536px) { ... }
      },
    },
  },
  plugins: [],
}