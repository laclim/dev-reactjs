import React from "react";
import { GetServerSideProps, GetStaticProps } from "next";
import { gql, useQuery } from "@apollo/client";
import { initializeApollo } from "../../src/component/config/apollo";
import edjsHTML from "editorjs-html";
import { Button, Container } from "@material-ui/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { jsonToHTML } from "../../src/jsonToHTML";
import Head from "next/head";
import Comment from "../../src/component/Comment";
import theme from "../../src/component/Theme/lightTheme";
// import { gqlClient } from "../src/component/config/apollo";
const GET_POST = gql`
  query getPost($slug: String!) {
    post(slug: $slug) {
      id
      title
      content
      tag
      createdBy {
        name
      }
      createdAt
      updatedAt
    }
    isEditPost(slug: $slug)
  }
`;
function Post(props) {
  const router = useRouter();
  const { post, isEditPost } = props;

  function customParser(block) {
    return `<custom-tag> ${block.data.text} </custom-tag>`;
  }

  const edjsParser = edjsHTML({ heading: customParser });

  return (
    <React.Fragment>
      <Head>
        <title>{post.title}</title>
        <meta property="og:title" content={post.title} key="title" />
      </Head>

      {isEditPost && (
        <Link href={router.asPath + "/edit"} passHref>
          <Button color="secondary">Edit</Button>
        </Link>
      )}

      {jsonToHTML(post)}
      <Container style={{ padding: theme.spacing(2) }}>
        {" "}
        <Comment postID={post.id} />{" "}
      </Container>
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

export default Post;
