import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";

import Typography from "@material-ui/core/Typography";

import { useContextState } from "../../context";
import { Box, TextField } from "@material-ui/core";
import Logo from "../svg/logo";
import { getS3Image } from "../../helper";
import getConfig from "next/config";
import { gql, useMutation } from "@apollo/client";
const useStyles = makeStyles({
  avatar: {
    width: 32,
    margin: 4,
  },
});

const UPDATE_USER = gql`
  mutation updateUser($email: String) {
    updateUser(input: { email: $email }) {
      id
      email
    }
  }
`;
export interface FirstTimeLoginDialogProps {
  open: boolean;
}

export default function FirstTimeLoginDialog(props: FirstTimeLoginDialogProps) {
  const { publicRuntimeConfig } = getConfig();
  const [updateUser, { data }] = useMutation(UPDATE_USER);
  const classes = useStyles();
  const { open } = props;
  const [email, setEmail] = useState("");
  function handleNextStep() {
    updateUser({ variables: { email } }).then(() => {
      location.reload();
    });
  }
  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      aria-labelledby="simple-dialog-title"
      open={open}
      disableBackdropClick
    >
      <DialogTitle id="simple-dialog-title">
        <Box textAlign="center">
          <Logo stopColor="#ffffff" height="64"></Logo>
        </Box>
        <Box textAlign="center">
          <TextField
            label="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></TextField>
        </Box>
        <Box textAlign="center">
          <Button onClick={() => handleNextStep()}>save</Button>
        </Box>
      </DialogTitle>
      <Box marginX="auto" marginY={4}></Box>
    </Dialog>
  );
}
