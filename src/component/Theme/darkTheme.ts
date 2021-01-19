import { createMuiTheme } from "@material-ui/core/styles";
import { red, grey } from "@material-ui/core/colors";
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
      main: grey[300],
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
