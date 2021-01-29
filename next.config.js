const path = require('path');
const withImages = require('next-images')
module.exports = withImages({
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
    COOKIES_DOMAIN: process.env.COOKIES_DOMAIN
  },
  exclude: path.resolve(__dirname, 'src/images/svg'),
  webpack(config, options) {
    return config
  }  
});

