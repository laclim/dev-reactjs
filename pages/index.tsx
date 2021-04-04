import { gql, useQuery } from "@apollo/client";
import {
  Container,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import Posts from "../src/component/Posts";
import TagList from "../src/component/TagList";
import { GetServerSideProps } from "next";
import { PROFILE } from "../api";
import { initializeApollo } from "../src/component/config/apollo";
import ProfilePage from "./user/[slug]";

const GET_POSTS = gql`
  query {
    posts {
      id
      title
      createdAt
      updatedAt
      slug
      createdBy {
        name
        profileImage
      }
      content
      description
    }
    tags {
      name
    }
  }
`;

function Home({ mainPage, statusCode, profile, posts }) {
  return (
    <React.Fragment>
      <div className="container">
        {mainPage ? (
          <Index />
        ) : (
          <ProfilePage
            posts={posts}
            profile={profile}
            statusCode={statusCode}
          />
        )}
      </div>
    </React.Fragment>
  );
}

function Profile({ mainPage, statusCode, profile }) {
  return (
    <React.Fragment>
      <div className="container">
        {mainPage ? <Index /> : <div>{profile.name}</div>}
      </div>
    </React.Fragment>
  );
}
const useStyles = makeStyles((theme) => ({
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
  const { loading, error, data } = useQuery(GET_POSTS);
  // if (loading) return <React.Fragment>Loading...</React.Fragment>;
  // if (error) return <React.Fragment>Error! {error.message}</React.Fragment>;

  const classes = useStyles();
  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <Grid container spacing={1}>
          <Grid item lg={10} xs={12}>
            {!loading && <TagList data={data?.tags}></TagList>}
            {!loading && <Posts data={data?.posts}></Posts>}
          </Grid>
          <Grid item lg={2} xs={12}>
            <Paper className={classes.paper}>g2</Paper>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Fetch data from external API
  let mainPage = true;
  const host = context.req.headers.host;
  var patt1 = /(.*?)\.[a-z0-9]+(.com|:)/;
  var result = host.match(patt1);
  let user = null;
  let profile = null;
  let posts = null;
  let statusCode = null;
  if (result) {
    user = result[1];
  }

  if (user) {
    mainPage = false;
    const apolloClient = initializeApollo(context);

    await apolloClient
      .query({
        query: PROFILE,
        variables: { slug: user },
      })
      .then((res) => {
        if (res?.data?.profile) {
          profile = res?.data?.profile;
          posts = res.data.profile.posts;
        } else {
          statusCode = 404;
        }
      })
      .catch((e) => {
        console.log(e);
        statusCode = 404;
      });
  }

  return {
    props: { mainPage, statusCode, profile, posts },
  };
};

export default Home;
