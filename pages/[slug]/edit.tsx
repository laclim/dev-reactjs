import { gql } from "@apollo/client/core";
import { GetServerSideProps } from "next";
import React from "react";
import { useState } from "react";
import { initializeApollo } from "../../src/component/config/apollo";
import Editor from "../../src/component/Editor";
import Error from "next/error";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import Head from "next/head";
import { Button } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useRouter } from "next/router";

const GET_POST = gql`
  query getPost($slug: String!) {
    post(slug: $slug) {
      id
      title
      content
      tag {
        name
      }
      slug
      createdBy {
        name
      }
      createdAt
      updatedAt
    }
    isEditPost(slug: $slug)
  }
`;

const UPDATE_POST = gql`
  mutation UpdatePostMutation($id: ID!, $input: PostInput) {
    updatePost(id: $id, input: $input) {
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
function EditPost({ post, isEditPost }) {
  const router = useRouter();
  const classes = useStyles();
  const [content, setContent] = useState(post?.content);

  if (!isEditPost) {
    return <Error statusCode={404}></Error>;
  }
  const { title, tag } = post;
  const tagName = tag.map((el) => el.name);
  const [tagList, setTagList] = useState(tagName);
  const { register, handleSubmit, errors } = useForm({
    defaultValues: { title, tag: tagName },
  });

  const onSubmit = (data) => {
    data = { ...data, content, tag: tagList };
    console.log(data);
    updatePost({ variables: { id: post.id, input: data } }).then(() => {
      router.push("/" + post.slug);
    });
  };
  const [updatePost, { data }] = useMutation(UPDATE_POST);
  const onDraft = (data) => {
    data = { ...data, content, tag: tagList, status: false };
    updatePost({ variables: { id: post.id, input: data } }).then(() => {
      router.push("/" + post.slug);
    });
  };

  return (
    <React.Fragment>
      <Head>
        <title>{post.title}</title>
        <meta property="og:title" content={post.title} key="title" />
      </Head>
      <Editor
        content={content}
        setContent={setContent}
        register={register}
        title={post.title}
        setTagList={setTagList}
        tagList={tagList}
      >
        <React.Fragment>
          <div className={classes.buttons}>
            <Button
              variant="contained"
              name="draft"
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
              Update
            </Button>
          </div>
        </React.Fragment>
      </Editor>
    </React.Fragment>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Fetch data from external API

  const { slug } = context.params;
  const apolloClient = initializeApollo(context);
  let post,
    isEditPost = null;
  await apolloClient
    .query({
      query: GET_POST,
      variables: { slug },
    })
    .then((data) => {
      post = data.data.post;
      isEditPost = data.data.isEditPost;
    });

  return {
    props: {
      post,
      isEditPost,
    },
  };
};

export default EditPost;
