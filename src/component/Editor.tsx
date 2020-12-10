import { gql, useMutation } from "@apollo/client";
import {
  makeStyles,
  Container,
  Paper,
  Grid,
  TextField,
  Button,
} from "@material-ui/core";

import React, { useEffect, useState } from "react";
import { useParentStyles } from "../style";

import editorJSConfig from "./config/editorJS";

function Editor({
  children,
  content,
  setContent,
  onSubmit,
  register,
  title,
  tag,
}: {
  children: any;
  content: Array<Object>;
  setContent: any;
  onSubmit: any;
  register: any;
  title?: string;
  tag?: Array<string>;
}) {
  const [loadEditor, setLoadEditor] = useState(false);
  const classes = useParentStyles();
  if (!loadEditor && typeof window !== "undefined") {
    editorJSConfig(content, setContent, setLoadEditor);
  }

  return (
    <React.Fragment>
      <Paper className={classes.paper}>
        <form>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="title"
                inputRef={register}
                label="Title"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="tag"
                inputRef={register}
                label="Tags"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <div id="editorjs"></div>
            </Grid>
          </Grid>
          {children}
        </form>
      </Paper>
    </React.Fragment>
  );
}

export default Editor;
