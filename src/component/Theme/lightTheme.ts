import { createMuiTheme } from "@material-ui/core/styles";
import { red, grey } from "@material-ui/core/colors";
import responsiveFontSizes from "@material-ui/core/styles/responsiveFontSizes";

// Create a theme instance.
let theme = createMuiTheme({
  palette: {
    primary: {
      main: "#f5f5f5",
    },
    secondary: {
      main: grey[500],
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
