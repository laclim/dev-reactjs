import React from "react";
import { useContextState } from "../../context";
import lightTheme from "./lightTheme";
import darkTheme from "./darkTheme";
import { ThemeProvider, CssBaseline } from "@material-ui/core";
const MyTheme = ({ children }) => {
  const { isDarkTheme } = useContextState();
  let theme;
  if (isDarkTheme) {
    theme = darkTheme;
  } else {
    theme = lightTheme;
  }
  theme.typography.h1 = {
    fontSize: "1.4rem",
    "@media (min-width:600px)": {
      fontSize: "1.5rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "2.8rem",
    },
  };
  theme.typography.h2 = {
    fontSize: "1.3rem",
    "@media (min-width:600px)": {
      fontSize: "1.5rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "2.4rem",
    },
  };
  theme.typography.h3 = {
    fontSize: "1.2rem",
    "@media (min-width:600px)": {
      fontSize: "1.5rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "2rem",
    },
  };
  theme.typography.h4 = {
    fontSize: "1.1rem",
    "@media (min-width:600px)": {
      fontSize: "1.5rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1.8rem",
    },
  };
  theme.typography.h5 = {
    fontSize: "1.0rem",
    "@media (min-width:600px)": {
      fontSize: "1.5rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1.6rem",
    },
  };
  theme.typography.h6 = {
    fontSize: "1.0rem",
    "@media (min-width:600px)": {
      fontSize: "1.5rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1.4rem",
    },
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default MyTheme;
