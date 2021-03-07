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
  errors,
}: {
  children: any;
  content: Array<Object>;
  setContent: any;
  register: any;
  title?: string;
  setTagList: any;
  tagList?: Array<string>;
  errors: any;
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
                helperText={errors?.title && "This field is required"}
                error={errors?.title}
                inputProps={{ maxLength: 200 }}
              />
              <Typography variant="caption" style={{ float: "right" }}>
                {currentLength}/200
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
                placeholder="Enter &#9166; to add tag"
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
