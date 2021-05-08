import React from "react";
import { GetServerSideProps, GetStaticProps } from "next";
import { gql, useQuery } from "@apollo/client";
import { initializeApollo } from "../../src/component/config/apollo";

import {
  Box,
  Button,
  Container,
  Typography,
  Avatar,
  IconButton,
} from "@material-ui/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { jsonToHTML } from "../../src/jsonToHTML";
import Head from "next/head";
import Comment from "../../src/component/Comment";
import theme from "../../src/component/Theme/lightTheme";
import { getS3Image } from "../../src/helper";
import Error from "next/error";
import BookmarkButton from "../../src/component/BookmarkButton";

// import { gqlClient } from "../src/component/config/apollo";
const GET_POST = gql`
  query getPost($slug: String!) {
    post(slug: $slug) {
      id
      title
      content
      description
      tag {
        name
      }
      createdBy {
        name
        profileImage
      }
      isBookmarked
      createdAt
      updatedAt
    }
    isEditPost(slug: $slug)
  }
`;
function Post(props: { post: any; isEditPost: any; statusCode: any }) {
  const router = useRouter();
  const { post, isEditPost, statusCode } = props;
  if (statusCode) {
    return <Error statusCode={statusCode}></Error>;
  }
  if (post) {
    return (
      <React.Fragment>
        <Head>
          <title>{post?.title}</title>
          <meta
            property="og:description"
            content={post?.description}
            key="description"
          />
          <meta property="og:title" content={post?.title} key="title" />
        </Head>

        {isEditPost && (
          <Link href={router.asPath + "/edit"} passHref>
            <Button color="secondary">Edit</Button>
          </Link>
        )}
        <BookmarkButton
          isBookmarked={post.isBookmarked}
          postID={post.id}
        ></BookmarkButton>
        <Typography variant="h1">{post?.title}</Typography>
        <Avatar
          alt={post?.createdBy.name}
          src={getS3Image(post?.createdBy.profileImage, 100, 100)}
        />
        <Box display="flex">
          {post?.tag &&
            post?.tag.map(
              (el: { name: React.ReactNode }, i: React.ReactText) => (
                <Box key={i} m={1} p={1} boxShadow={1} borderRadius={10}>
                  <Typography variant="subtitle1">#{el.name}</Typography>
                </Box>
              )
            )}
        </Box>
        {jsonToHTML(post)}
        <Container style={{ padding: theme.spacing(2) }}>
          {" "}
          <Comment postID={post?.id} />{" "}
        </Container>
      </React.Fragment>
    );
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Fetch data from external API

  const { slug } = context.params;
  const apolloClient = initializeApollo(context);
  let post, isEditPost, statusCode;
  post = isEditPost = statusCode = null;
  const host = context.req.headers.host;
  var patt1 = /(.*?)\.[a-z0-9]+(.com|:)/;
  var result = host.match(patt1); 
  let user = null;
  if (result) {
    user = result[1];
  }
  await apolloClient
    .query({
      query: GET_POST,
      variables: { slug },
    })
    .then((data: { data: { post: any; isEditPost: any } }) => {
      post = data.data.post;
      isEditPost = data.data.isEditPost;

      if (!post) {
        statusCode = 404;
      }
    })
    .catch((e) => {
      console.log(e);
      statusCode = 404;
      console.log(post, isEditPost, statusCode);
    });
  return {
    props: {
      post,
      isEditPost,
      statusCode,
    },
  };
};

export default Post;
