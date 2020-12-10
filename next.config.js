module.exports = {
  env: {
    customKey: "my-value",
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    staticFolder: "/static",
    BASE_URL: process.env.BASE_URL,
    GRAPH_URL: process.env.GRAPH_URL,
    NODE_ENV: process.env.NODE_ENV,
    CLOUDFRONT_URL: process.env.CLOUDFRONT_URL,
    RESIZE_CLOUDFRONT_URL: process.env.RESIZE_CLOUDFRONT_URL
  },
};
