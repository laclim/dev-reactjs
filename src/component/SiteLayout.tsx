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

import { StyledLink } from "./StyledLink";
import { useParentStyles } from "../style";
import Cookies from "universal-cookie";
import { getS3Image } from "../helper";
import LoginDialog from "./Dialog/LoginDialog";
import FirstTImeLoginDialog from "./Dialog/FirstTImeLoginDialog";
import Logo from "./svg/logo";
import getConfig from "next/config";
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";
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
  const dispatch = useContextDispatch();
  const { firstTimeLogin } = useContextState();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const themeColorLS = localStorage.getItem("color-theme");
    if (themeColorLS == "dark") {
      setIsDark(true);
    }
    dispatch({ type: "switchTheme", themeColor: themeColorLS });
  }, []);
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

  const handleClose = () => {
    setOpen(false);
  };
  const matches = useMediaQuery("(max-width:600px)");
  return (
    <div className={classes.root}>
      <Head>
        <title>JobInsider: Log In or Sign Up</title>
        <meta
          property="og:description"
          content="JobInsider is a community where people can share their working experience in the industry/company. It tells the stories you want to know. Free speech for everyone"
          key="description"
        />
        <meta
          name="Description"
          content="JobInsider is a community where people can share their working experience in the industry/company. It tells the stories you want to know. Free speech for everyone"
        ></meta>
        <link rel="icon" href="/j.ico" />
      </Head>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          {matches && (
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          )}
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
                ></Button>

                <MenuDropdown
                  displayName={displayName}
                  anchorEl={anchorEl}
                  setAnchorEl={setAnchorEl}
                />
              </Box>
            </div>
          )}

          <Switch
            checked={isDark}
            onChange={(e) => {
              let themeColor = "";
              if (e.target.checked) {
                themeColor = "dark";
              } else {
                themeColor = "light";
              }
              dispatch({ type: "switchTheme", themeColor });
              localStorage.setItem("color-theme", themeColor);
              setIsDark(e.target.checked);
            }}
            name="switch"
            inputProps={{ "aria-label": "secondary checkbox" }}
          />
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <div className={classes.content}>{children}</div>
        {firstTimeLogin && <FirstTImeLoginDialog open={firstTimeLogin} />}
      </Container>
    </div>
  );
};

function MenuDropdown({ anchorEl, setAnchorEl, displayName }) {
  const { publicRuntimeConfig } = getConfig();
  const parentClasses = useParentStyles();
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    const cookies = new Cookies();
    cookies.remove("graph_token", {
      path: "/",
      domain: publicRuntimeConfig.COOKIES_DOMAIN,
    });
    window.location.reload();
  };
  return (
    <Menu
      id="simple-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <MenuItem onClick={handleClose}>
        <Link
          href="/user/[name]"
          as={`/user/${displayName.replace(" ", "-")}`}
          passHref
        >
          <a className={parentClasses.a}>{displayName}</a>
        </Link>
      </MenuItem>

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
