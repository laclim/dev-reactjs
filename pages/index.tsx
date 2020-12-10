import { gql, useQuery } from "@apollo/client";
import { Container, Grid, makeStyles, Paper } from "@material-ui/core";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import Posts from "../src/component/Posts";

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
      }
      content
    }
  }
`;

function Home() {
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Index />
    </div>
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
          <Grid item lg={3}>
            <Paper className={classes.paper}>g2</Paper>
          </Grid>
          <Grid item lg={7}>
            {!loading && <Posts data={data.posts}></Posts>}
          </Grid>
          <Grid item lg={2}>
            <Paper className={classes.paper}>g2</Paper>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
}

Home.getInitialProps = async (appContext) => {
  // const appProps = await App.getInitialProps(appContext);

  return { asd: "sadas" };
};

export default Home;
