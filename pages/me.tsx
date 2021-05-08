import { gql, useMutation } from "@apollo/client";
import {
  Typography,
  Grid,
  Paper,
  makeStyles,
  Avatar,
  Box,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { GetServerSideProps } from "next";
import React, { useEffect } from "react";
import { initializeApollo } from "../src/component/config/apollo";
import { useParentStyles } from "../src/style";
import Error from "next/error";

import { getS3Image, uploadImage } from "../src/helper";
import { useState } from "react";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import IconButton from "@material-ui/core/IconButton/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { SingleEditInput } from "../src/component/SingleEditInput";
import clsx from "clsx";
const ME = gql`
  query {
    me {
      profile {
        email
        name
        profileImage
        biodata
        createdAt
        slug
        link {
          github
          linkedIn
        }
      }
    }
  }
`;

const UPDATE_PROFILE = gql`
  mutation updateProfile(
    $email: String
    $biodata: String
    $name: String
    $github: String
    $linkedIn: String
    $profileImage: String
  ) {
    updateProfile(
      input: {
        email: $email
        link: { github: $github, linkedIn: $linkedIn }
        biodata: $biodata
        name: $name
        profileImage: $profileImage
      }
    ) {
      id
      email
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  textarea: {
    width: "100%",
    background: "none",
    color: theme.palette.text.primary,
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  camera: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: "rgba(0,0,0,.48)",
  },
  drawerOpen: {
    width: 240,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  drawer: {
    width: 240,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  toolbar: theme.mixins.toolbar,
}));

function useEditableInput({ defaultValue, name }) {
  const [value, setValue] = useState(defaultValue || "");
  const [valueEdit, setValueEdit] = useState(false);
  const [updateProfile, { data }] = useMutation(UPDATE_PROFILE);

  const button = valueEdit ? (
    <React.Fragment>
      <IconButton onClick={() => setValueEdit(false)}>
        <CancelIcon />
      </IconButton>
      <IconButton
        onClick={() => {
          updateProfile({ variables: { [name]: value } }).then(() =>
            setValueEdit(false)
          );
        }}
      >
        <SaveIcon />
      </IconButton>
    </React.Fragment>
  ) : (
    <IconButton onClick={() => setValueEdit(true)}>
      <EditIcon />
    </IconButton>
  );
  return [value, setValue, button, valueEdit];
}

function Me({ me, statusCode }) {
  const parent_classes = useParentStyles();

  const [basicProfile, setBasicProfile] = useState([
    {
      name: "email",
      label: "Email",
      value: me?.profile?.email,
      type: "email",
    },
    {
      name: "name",
      label: "Name",
      value: me?.profile?.name,
    },
    {
      name: "slug",
      label: "Slug",
      value: me?.profile?.slug,
    },
    {
      name: "biodata",
      label: "Biodata",
      value: me?.profile?.biodata,

      // multiline: true,
      // rowsMax: 4,
    },
  ]);

  const [linkProfile, setLinkProfile] = useState([
    {
      name: "linkedIn",
      label: "LinkedIn",
      value: me?.profile?.link?.linkedIn,
    },
    {
      name: "github",
      label: "Github",
      value: me?.profile?.link?.github,
    },
  ]);

  const classes = useStyles();

  const [updateAPI, { data }] = useMutation(UPDATE_PROFILE);

  const [
    profileImage,
    setProfileImage,
    EditProfileImageButton,
    profileImageEdit,
  ] = useEditableInput({
    defaultValue: me?.profile?.profileImage,
    name: "profileImage",
  });

  if (statusCode) {
    return <Error statusCode={statusCode}></Error>;
  }
  return (
    <React.Fragment>
      <Drawer
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
        variant="permanent"
        anchor="left"
      >
        <div className={classes.toolbar} />
        <Divider />
        <List>
          {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
            <ListItem button key={text}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {["All mail", "Trash", "Spam"].map((text, index) => (
            <ListItem button key={text}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Paper className={parent_classes.paper}>
        <Box display="flex">
          <Box flexGrow={1} fontWeight={700}>
            <Typography variant="h2">Profile</Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {basicProfile.map((el, i) => (
            <Grid item xs={12} md={12}>
              <SingleEditInput
                attr={el}
                setDataField={setBasicProfile}
                dataField={basicProfile}
                updateAPI={updateAPI}
              ></SingleEditInput>
            </Grid>
          ))}

          <Grid item xs={12} md={12}>
            <Box
              display="flex"
              justifyContent="center"
              p={1}
              bgcolor="background.paper"
            >
              <Box>
                <div style={{ position: "relative" }}>
                  <Avatar
                    src={getS3Image(profileImage, 150, 150)}
                    className={classes.large}
                  />
                  {profileImageEdit && (
                    <Avatar className={classes.camera}>
                      <IconButton component="label">
                        <CameraAltIcon style={{ color: "white" }} />
                        <InputFile setProfileImage={setProfileImage} />
                      </IconButton>
                    </Avatar>
                  )}
                </div>
              </Box>
              <Box>{EditProfileImageButton}</Box>
              <Box p={1}>
                <Typography variant="caption">*File size limit 1 MB</Typography>
              </Box>
            </Box>
          </Grid>
          <Box display="flex">
            <Box flexGrow={1} fontWeight={700}>
              <Typography variant="h2">Link</Typography>
            </Box>
          </Box>
          {linkProfile.map((el, i) => (
            <Grid item xs={12} md={12}>
              <SingleEditInput
                attr={el}
                setDataField={setLinkProfile}
                dataField={linkProfile}
                updateAPI={updateAPI}
              ></SingleEditInput>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </React.Fragment>
  );
}
const InputFile = ({ setProfileImage }) => {
  return (
    <input
      type="file"
      hidden
      accept="image/*"
      onChange={async (event) => {
        if (event.target.files.length) {
          if (event.target.files[0]?.size > 1048576) {
            alert("File size limit 1mb");
          } else {
            const { url, key } = await uploadImage(event.target.files[0]);
            setProfileImage(key);
          }
        }
      }}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Fetch data from external API
  let me = null;
  let statusCode = null;
  const apolloClient = initializeApollo(context);
  await apolloClient
    .query({
      query: ME,
    })
    .then((data: { data: { me: any } }) => {
      if (data?.data?.me) me = data?.data?.me;
      else statusCode = 404;
    })
    .catch(() => {
      statusCode = 404;
    });

  return {
    props: {
      me,
      statusCode,
    },
  };
};

export default Me;
