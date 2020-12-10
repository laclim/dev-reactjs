import { gql, useMutation } from "@apollo/client";
import {
  Typography,
  Grid,
  TextField,
  Paper,
  makeStyles,
  Button,
  Avatar,
  Box,
} from "@material-ui/core";
import { GetServerSideProps } from "next";
import React, { useEffect } from "react";
import { initializeApollo } from "../src/component/config/apollo";
import { useParentStyles } from "../src/style";
import Error from "next/error";
import axios from "axios";
import { getS3Image, uploadImage } from "../src/helper";
import { useForm } from "react-hook-form";
import { useState } from "react";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import IconButton from "@material-ui/core/IconButton/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
const ME = gql`
  query {
    me {
      profile {
        email
        name
        profileImage
        biodata
        createdAt
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
}));

function useInput({ type /*...*/ }) {
  const [value, setValue] = useState("");
  const input = (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      type={type}
    />
  );
  return [value, input];
}

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

  const classes = useStyles();
  const [email, setEmail, EditEmailButton, emailEdit] = useEditableInput({
    defaultValue: me.profile.email,
    name: "email",
  });
  const [name, setName, EditNameButton, nameEdit] = useEditableInput({
    defaultValue: me.profile.name,
    name: "name",
  });
  const [
    biodata,
    setBiodata,
    EditBiodataButton,
    biodataEdit,
  ] = useEditableInput({
    defaultValue: me.profile.biodata,
    name: "biodata",
  });
  const [
    profileImage,
    setProfileImage,
    EditProfileImageButton,
    profileImageEdit,
  ] = useEditableInput({
    defaultValue: me.profile.profileImage,
    name: "profileImage",
  });

  if (statusCode) {
    return <Error statusCode={statusCode}></Error>;
  }
  return (
    <React.Fragment>
      <Paper className={parent_classes.paper}>
        <Box display="flex">
          <Box flexGrow={1} fontWeight={700}>
            <Typography variant="h2">Profile</Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              type="email"
              fullWidth
              disabled={!emailEdit}
              autoComplete="email"
              InputProps={{
                endAdornment: EditEmailButton,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              name="Name"
              label="name"
              fullWidth
              disabled={!nameEdit}
              InputProps={{
                endAdornment: EditNameButton,
              }}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              required
              value={biodata}
              name="Biodata"
              label="biodata"
              onChange={(e) => setBiodata(e.target.value)}
              fullWidth
              multiline
              rowsMax={4}
              disabled={!biodataEdit}
              InputProps={{
                endAdornment: EditBiodataButton,
              }}
            />
          </Grid>

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
                    alt="Remy Sharp"
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
    .then((data) => {
      me = data?.data?.me;
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
