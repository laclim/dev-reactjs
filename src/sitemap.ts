import sitemap from "nextjs-sitemap-generator";
import fs from "fs";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
const GET_TAGS = gql`
  query getTags {
    tags {
      name
    }
  }
`;

const client = new ApolloClient({
  uri: "https://jobinsiderblog.com/graphql",
  cache: new InMemoryCache(),
});

// const BUILD_ID = fs.readFileSync(".next/BUILD_ID").toString();
sitemap({
  baseUrl: "https://jobinsiderblog.com",
  // If you are using Vercel platform to deploy change the route to /.next/serverless/pages
  pagesDirectory: __dirname + "\\pages",
  targetDirectory: "public/",
  ignoredExtensions: ["js", "map"],
  ignoredPaths: ["/me", "/api", "/post"], // Exclude everything that isn't static page
  pagesConfig: {
    "/login": {
      priority: "0.5",
      changefreq: "daily",
    },
  },
  sitemapStylesheet: [
    // {
    //   type: "text/css",
    //   styleFile: "/test/styles.css",
    // },
    {
      type: "text/xsl",
      styleFile: "sitemap.xsl",
    },
  ],
});

console.log(`✅ sitemap.xml generated!`);
