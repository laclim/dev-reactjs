import { useMemo } from "react";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import getConfig from "next/config";
import { setContext } from "@apollo/client/link/context";
import Cookies from "universal-cookie";
let apolloClient;

function createIsomorphLink(ctx) {
  let authLink = null;
  if (ctx.req) {
    const cookies = new Cookies(ctx.req.headers.cookie);
    const token = cookies.get("graph_token");
    authLink = setContext((_, { headers }) => {
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        },
      };
    });
  }
  if (typeof window === "undefined") {
    return authLink.concat(
      createHttpLink({
        uri: process.env.GRAPH_URL,
      })
    );
  } else {
    const { publicRuntimeConfig } = getConfig();
    // const { HttpLink } = require("@apollo/client/link/http");
    return createHttpLink({
      uri: publicRuntimeConfig.GRAPH_URL,
    });
  }
}

function createApolloClient(ctx) {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: createIsomorphLink(ctx),
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient(initialState);

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
