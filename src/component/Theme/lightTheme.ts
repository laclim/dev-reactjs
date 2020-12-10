import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import responsiveFontSizes from "@material-ui/core/styles/responsiveFontSizes";

// Create a theme instance.
let theme = createMuiTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#cc4444",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#f5f5f5",
    },
    action: {
      disabled: "red",
      disabledBackground: "red",
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
