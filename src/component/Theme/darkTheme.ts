import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import responsiveFontSizes from "@material-ui/core/styles/responsiveFontSizes";

// Dark theme
let theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#333",
      light: "rgb(81, 91, 95)",
      dark: "rgb(26, 35, 39)",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#FFB74D",
      light: "rgb(255, 197, 112)",
      dark: "rgb(200, 147, 89)",
      contrastText: "rgba(0, 0, 0, 0.87)",
    },

    error: {
      main: red.A400,
    },
    background: {
      default: "#222222",
    },
  },
});
theme = responsiveFontSizes(theme);
export default theme;
