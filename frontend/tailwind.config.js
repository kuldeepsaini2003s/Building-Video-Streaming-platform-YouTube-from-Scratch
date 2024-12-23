module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        white: "#fdfdff",
        black: "#000000",
        icon_black: "#292929",
        Lightblack: "#5a5a5a",
        Gray: "#cccccc",
        lightgray: "#f2f2f2",
        hover_icon_black: "#3b3b3b",
        lightblue: "#9fc1ee",
      },
      screens: {
        ms: "320px",
        // => @media (min-width: 320px) { ... }

        mm: "375px",
        // => @media (min-width: 375px) { ... }

        ml: "429px",
        // => @media (min-width: 425px) { ... }

        sm: "600px",
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
  darkMode: "class",
};
