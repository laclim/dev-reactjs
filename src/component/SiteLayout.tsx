import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { useContextDispatch, useContextState } from "../context";
import Switch from "@material-ui/core/Switch";
import Link from "next/link";
import { Box, Container, Avatar, Fab, Menu, MenuItem } from "@material-ui/core";
import Head from "next/head";
import theme from "./Theme/lightTheme";
import { StyledLink } from "./StyledLink";
import { useParentStyles } from "../style";
import Cookies from "universal-cookie";
import { getS3Image } from "../helper";
import LoginDialog from "./LoginDialog";
import Logo from "./svg/logo";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  content: {
    marginTop: theme.spacing(8),
    justifyContent: "center",
  },
}));

const SiteLayout = ({ children }) => {
  return <div>{<MenuBar children={children} />}</div>;
};

const MenuBar = ({ children }) => {
  const { isDarkTheme } = useContextState();
  const dispatch = useContextDispatch();
  const { loggedIn, displayName, profileImage } = useContextState();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
  };
  return (
    <div className={classes.root}>
      <Head>
        <title>JobInsider</title>
        <meta
          property="og:description"
          content="JobInsider is a community where people can share their working experience in the industry/company. It tells the stories you want to know."
          key="description"
        />
        <link rel="icon" href="/j.ico" />
      </Head>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Box flexGrow={1}>
            <Link href="/">
              <a>
                <Logo></Logo>
              </a>
            </Link>
          </Box>
          {!loggedIn ? (
            <React.Fragment>
              <Button variant="outlined" onClick={handleClickOpen}>
                Login
              </Button>
              <LoginDialog open={open} onClose={handleClose} />
            </React.Fragment>
          ) : (
            <div>
              <Box display="flex" alignItems="center">
                <Link href="/post" passHref>
                  <Button>Create Post</Button>
                </Link>

                <Button
                  aria-controls="simple-menu"
                  onClick={handleClick}
                  startIcon={
                    <Avatar src={getS3Image(profileImage, 150, 150)} />
                  }
                >
                  {displayName}
                </Button>

                <MenuDropdown anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
              </Box>
            </div>
          )}

          <Switch
            checked={isDarkTheme}
            onChange={(e) => {
              dispatch({ type: "switchTheme", isDarkTheme: e.target.checked });
            }}
            name="switch"
            inputProps={{ "aria-label": "secondary checkbox" }}
          />
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <div className={classes.content}>{children}</div>
      </Container>
    </div>
  );
};

function MenuDropdown({ anchorEl, setAnchorEl }) {
  const parentClasses = useParentStyles();
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    const cookies = new Cookies();
    cookies.remove("graph_token", { path: "/" });
    window.location.reload();
  };
  return (
    <Menu
      id="simple-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      {/* <MenuItem onClick={handleClose}>
        <StyledLink href="/profile">Profile</StyledLink>
      </MenuItem> */}

      <MenuItem onClick={handleClose}>
        <Link href="/me" passHref>
          <a className={parentClasses.a}>My account</a>
        </Link>
      </MenuItem>

      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );
}
export default SiteLayout;
