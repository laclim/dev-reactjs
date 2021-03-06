import Head from "next/head";
import React, { useEffect, useState } from "react";

import TextField from "@material-ui/core/TextField";
import { gql, useMutation } from "@apollo/client";
import Editor from "../src/component/Editor";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Container,
  Grid,
  makeStyles,
  Paper,
} from "@material-ui/core";
import { useContextDispatch, useContextState } from "../src/context";
import LoginDialog from "../src/component/Dialog/LoginDialog";
import { ifNoLoginShowDialog } from "../src/helper";
function Post() {
  return (
    <div className="container">
      <Head>
        <title>New story</title>
      </Head>
      <Index />
    </div>
  );
}

interface MyFormValues {
  title: string;
  content: string;
  tag: string;
}

const ADD_POST = gql`
  mutation CreatePostMutation($input: PostInput) {
    createPost(input: $input) {
      slug
      id
    }
  }
`;
const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
}));
function Index() {
  ifNoLoginShowDialog();
  const [content, setContent] = useState([]);
  const [tagList, setTagList] = useState([]);
  const classes = useStyles();
  const router = useRouter();
  const { register, handleSubmit, errors } = useForm({
    // defaultValues: { title, tag },
  });

  const onSubmit = (data) => {
    data = { ...data, content, tag: tagList, status: true };

    addPost({ variables: { input: data } }).then((res) => {
      const { slug } = res.data.createPost;
      router.push("/" + slug);
    });
  };
  const [addPost, { data }] = useMutation(ADD_POST);
  const onDraft = (data) => {
    data = { ...data, content, tag: tagList, status: false };
    addPost({ variables: { input: data } }).then((res) => {
      const { slug } = res.data.createPost;
      router.push("/" + slug);
    });
  };
  return (
    <React.Fragment>
      <Editor
        content={content}
        setContent={setContent}
        register={register}
        tagList={tagList}
        setTagList={setTagList}
        errors={errors}
      >
        <React.Fragment>
          <div className={classes.buttons}>
            <Button
              variant="contained"
              name="draft"
              type="submit"
              onClick={handleSubmit(onDraft)}
              className={classes.button}
            >
              Draft
            </Button>
            <Button
              variant="contained"
              type="submit"
              name="save"
              onClick={handleSubmit(onSubmit)}
              className={classes.button}
            >
              Save
            </Button>
          </div>
        </React.Fragment>
      </Editor>
    </React.Fragment>
  );
}

Post.getInitialProps = async (appContext) => {
  return {};
};

export default Post;
