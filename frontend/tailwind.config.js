/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    // container: {
    //   center: true,
    //   padding: "16px",
    //   screens: {
    //     sm: "100%",
    //     md: "768px",
    //     lg: "1024px",
    //     xl: "1280px",
    //     "2xl": "1532px",
    //   },
    // },
    screens: {
      "1s": "321px",
      "1m": "376px",
      xs: "480px",
      sm: "640px",
      md: "768px",
      "1md": "991px",
      lg: "1024px",
      "1lg": "1150px",
      xl: "1280px",
      "1xl": "1440px",
      "2xl": "1536px",
      "3xl": "1700px",
    },
    extend: {
      colors: {
        black: "hsl(var(--color-black) / <alpha-value>)",
        body: "hsl(var(--color-body) / <alpha-value>)",
        input: "hsl(var(--color-input) / <alpha-value>)",
        primary: "hsl(var(--color-primary) / <alpha-value>)",
        secondary: "hsl(var(--color-secondary) / <alpha-value>)",
        success: "hsl(var(--color-success) / <alpha-value>)",
        warning: "hsl(var(--color-warning) / <alpha-value>)",
        danger: "hsl(var(--color-danger) / <alpha-value>)",
        accent: "hsl(var(--color-accent) / <alpha-value>)",
        info: "hsl(var(--color-info) / <alpha-value>)",
        background: "var(--background)",
        surface: "var(--color-off-white)",
        text: "var(--foreground)",
      },
      // fontFamily: {
      //   sans: ['"Work Sans"', "sans-serif"],
      // },
      keyframes: {
        progress: {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(400%)",
          },
        },
      },
      animation: {
        progress: "progress 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
