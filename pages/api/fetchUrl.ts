// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
const { getMetadata } = require("page-metadata-parser");
import domino from "domino";
export default async (req, res) => {
  const { url } = req.query;
  const response = await fetch(url);
  const html = await response.text();
  const doc = domino.createWindow(html).document;
  const metadata = getMetadata(doc, url);
  console.log(metadata);
  metadata.image = { url: metadata.image };
  const data = {
    success: 1,
    meta: metadata,
  };
  res.json(data);
};
