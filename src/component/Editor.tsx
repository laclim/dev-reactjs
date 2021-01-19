import { gql, useMutation } from "@apollo/client";
import {
  makeStyles,
  Container,
  Paper,
  Grid,
  TextField,
  Button,
  Chip,
  Box,
  Typography,
} from "@material-ui/core";

import React, { useEffect, useState } from "react";
import { useParentStyles } from "../style";
import FaceIcon from "@material-ui/icons/Face";
import DoneIcon from "@material-ui/icons/Done";
import editorJSConfig from "./config/editorJS";

function Editor({
  children,
  content,
  setContent,

  register,
  title,
  tagList,
  setTagList,
}: {
  children: any;
  content: Array<Object>;
  setContent: any;
  register: any;
  title?: string;
  setTagList: any;
  tagList?: Array<string>;
}) {
  const [loadEditor, setLoadEditor] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const [currentLength, setCurrentLength] = useState(
    (title && title.length) || 0
  );
  // const [tagList, setTagList] = useState(tag);
  const classes = useParentStyles();
  const handleDelete = (i) => {
    let deleted = [];
    tagList.forEach((el, index) => {
      if (i !== index) {
        deleted.push(el);
      }
    });
    // console.log(tagList);
    setTagList(deleted);
    console.info("You clicked the delete icon.");
  };
  if (!loadEditor && typeof window !== "undefined") {
    editorJSConfig(content, setContent, setLoadEditor);
  }
  const handleEnter = (e) => {
    if (e.keyCode == 13) {
      e.preventDefault();
      setTagList([...tagList, e.target.value]);
      setTagSearch("");
      // put the login here
    }
  };
  return (
    <React.Fragment>
      <Paper className={classes.paper}>
        <form>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="title"
                inputRef={register({ required: true })}
                label="Title"
                value={title}
                fullWidth
                onChange={(e) => setCurrentLength(e.target.value.length)}
                helperText={!title && "This field is required"}
                error={Boolean(!title)}
                inputProps={{ maxLength: 50 }}
              />
              <Typography variant="caption" style={{ float: "right" }}>
                {currentLength}/50
              </Typography>
            </Grid>
            {tagList.length
              ? tagList.map((tagName, i) => (
                  <Box mx={1}>
                    <Chip
                      key={i}
                      size="small"
                      label={tagName}
                      onDelete={() => handleDelete(i)}
                      color="primary"
                    />
                  </Box>
                ))
              : ""}

            <Grid item xs={12}>
              <TextField
                name="tag"
                variant="outlined"
                label="Tags"
                fullWidth
                value={tagSearch}
                onKeyDown={(e) => handleEnter(e)}
                onChange={(e) => setTagSearch(e.target.value)}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <div id="editorjs"></div>
          </Grid>

          {children}
        </form>
      </Paper>
    </React.Fragment>
  );
}

export default Editor;
