import Head from "next/head";
import { useContextState } from "../src/context";
import Router from "next/router";
import React from "react";
import { Button } from "@material-ui/core";

export default function Login() {
  const { loggedIn } = useContextState();
  const githubLogin = () => {
    location.replace(
      "https://github.com/login/oauth/authorize?client_id=4e6120fed050bc7dddb1"
    );
  };
  const connectLinkedIn = () => {
    location.replace(
      "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86fsfm3ho95j0p&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Flinkedin&scope=r_fullprofile%20r_emailaddress"
    );
  };
  if (loggedIn) {
    Router.push("/");
    return <div></div>;
  } else {
    return (
      <div>
        <Head>
          <title>Login</title>
        </Head>
        <React.Fragment>
          <Button onClick={githubLogin}>Github login</Button>
          <Button onClick={connectLinkedIn}>connect linkedin</Button>
        </React.Fragment>
      </div>
    );
  }
}
