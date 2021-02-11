import { gql, useMutation } from "@apollo/client";
import {
  Typography,
  Grid,
  Paper,
  makeStyles,
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
} from "@material-ui/core";
import { GetServerSideProps } from "next";
import React, { useEffect } from "react";
import { initializeApollo } from "../../src/component/config/apollo";
import { useParentStyles } from "../../src/style";
import Error from "next/error";

import { getS3Image, uploadImage } from "../../src/helper";
import { useState } from "react";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import IconButton from "@material-ui/core/IconButton/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { SingleEditInput } from "../../src/component/SingleEditInput";

import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import theme from "../../src/component/Theme/darkTheme";
const PROFILE = gql`
  query($slug: String) {
    profile(slug: $slug) {
      email
      name
      profileImage
      biodata
      createdAt
      slug
      publishedPostCount
      link {
        github
        linkedIn
      }
      posts {
        id
        title
        createdAt
        updatedAt
        slug
        content
        description
      }
    }
  }
`;

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  large: {
    width: theme.spacing(11),
    height: theme.spacing(11),
  },
});

function Profile({ profile, statusCode }) {
  const classes = useStyles();

  if (statusCode) {
    return <Error statusCode={statusCode}></Error>;
  } else {
    return (
      <React.Fragment>
        <Card>
          <CardActionArea>
            <Box p={2}>
              <Avatar
                src={getS3Image(profile.profileImage, 250, 250)}
                className={classes.large}
              />
            </Box>

            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {profile.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {profile.biodata}
              </Typography>
              {profile.publishedPostCount} articles published
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="small" href={profile?.link?.github} target="_blank">
              <GitHubIcon />
            </Button>
            <Button size="small" href={profile?.link?.linkedIn} target="_blank">
              <LinkedInIcon />
            </Button>
          </CardActions>
        </Card>
      </React.Fragment>
    );
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Fetch data from external API
  let profile = null;
  let statusCode = null;
  const { slug } = context.params;
  const apolloClient = initializeApollo(context);
  await apolloClient
    .query({
      query: PROFILE,
      variables: { slug },
    })
    .then((res) => {
      if (res?.data.profile) profile = res?.data?.profile;
      else statusCode = 404;
      console.log(profile);
    })
    .catch(() => {
      statusCode = 404;
    });

  return {
    props: {
      profile,
      statusCode,
    },
  };
};

export default Profile;
