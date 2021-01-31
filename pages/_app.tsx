import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";

import SiteLayout from "../src/component/SiteLayout";

import CustomSnackbar from "../src/component/CustomSnackbar";
import Context, { useContextState } from "../src/context";
import getConfig from "next/config";
import { setContext } from "@apollo/client/link/context";

import Cookies from "universal-cookie";
import {
  ApolloClient,
  createHttpLink,
  gql,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

import MyTheme from "../src/component/Theme";

// Only holds serverRuntimeConfig and publicRuntimeConfig
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

export default function MyApp(props) {
  const { Component, pageProps, serverProps } = props;
  const GRAPH_URL = publicRuntimeConfig.GRAPH_URL;
  const { displayName, profileImage, firstTimeLogin } = pageProps;
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  const cookies = new Cookies();
  const token = cookies.get("graph_token");

  const httpLink = createHttpLink({
    uri: GRAPH_URL,
  });
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });
  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return (
    <React.Fragment>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}

      <ApolloProvider client={client}>
        <Context defaultProps={{ displayName, profileImage, firstTimeLogin }}>
          <MyTheme>
            <SiteLayout>
              <Component {...pageProps} />
              <CustomSnackbar />
            </SiteLayout>
          </MyTheme>
        </Context>
      </ApolloProvider>
    </React.Fragment>
  );
}

MyApp.getInitialProps = async ({ ctx }) => {
  let displayName,
    profileImage = "";
  let loggedIn,
    firstTimeLogin = false;

  if (ctx.req) {
    const cookies = new Cookies(ctx.req.headers.cookie);
    const token = cookies.get("graph_token");

    if (token) {
      const httpLink = createHttpLink({
        uri: process.env.GRAPH_URL,
      });
      const authLink = setContext((_, { headers }) => {
        return {
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
          },
        };
      });
      const client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
      });
      await client
        .query({
          query: gql`
            query getMe {
              me {
                id
                email
                profile {
                  name
                  profileImage
                }
              }
            }
          `,
        })
        .then((result) => {
          const data = result.data.me;
          loggedIn = true;
          displayName = data.profile.name;
          profileImage = data.profile.profileImage;

          if (!data.email) {
            firstTimeLogin = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  return { pageProps: { displayName, profileImage, firstTimeLogin } };
};

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
