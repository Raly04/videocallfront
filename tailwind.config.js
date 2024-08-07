/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors : {
        primary : "#059669",
        secondary : "rgba(107, 114, 128, 0.12)",
        foregroundWhite : "#EEEEEE",
        foregroundBlack : "#111111",
      },
      fontSize : {
        vsm : "10px"
      },height :{
        "1/8" : "12.5%",
        "6/8" : "75%",
      }
    },
  },
  plugins: [],
}
