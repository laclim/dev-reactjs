import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import PersonIcon from "@material-ui/icons/Person";
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import { blue } from "@material-ui/core/colors";
import { useContextState } from "../context";
import { Box } from "@material-ui/core";
import Logo from "./svg/logo";
import { getS3Image } from "../helper";

const useStyles = makeStyles({
  avatar: {
    width: 32,
    margin: 4,
  },
});

export interface LoginDialogProps {
  open: boolean;

  onClose: (value: string) => void;
}

export default function LoginDialog(props: LoginDialogProps) {
  const classes = useStyles();
  const { onClose, open } = props;

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  const { loggedIn } = useContextState();
  const githubLogin = () => {
    location.replace(
      "https://github.com/login/oauth/authorize?client_id=4e6120fed050bc7dddb1"
    );
  };
  const connectLinkedIn = () => {
    location.replace(
      "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86fsfm3ho95j0p&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Flinkedin&scope=r_liteprofile%20r_emailaddress"
    );
  };

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      onClose={onClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">
        <Box textAlign="center">
          <Logo stopColor="#ffffff" height="64"></Logo>
        </Box>
        <Box textAlign="center">
          <Typography variant="caption">- Login with - </Typography>
        </Box>
      </DialogTitle>
      <Box marginX="auto" marginY={4}>
        <List>
          <ListItem button onClick={githubLogin} color="secondary">
            <img
              className={classes.avatar}
              src="/static/images/GitHub-Mark-64px.png"
            />

            <ListItemText primary="Github Login" />
          </ListItem>

          <ListItem button onClick={connectLinkedIn} color="secondary">
            <img
              className={classes.avatar}
              src={getS3Image("static/LI_In_Bug.png")}
            />

            <ListItemText primary="LinkedIn Login" />
          </ListItem>
        </List>
      </Box>
    </Dialog>
  );
}