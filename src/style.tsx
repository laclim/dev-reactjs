import makeStyles from "@material-ui/core/styles/makeStyles";

export const useParentStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  a: {
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
}));
