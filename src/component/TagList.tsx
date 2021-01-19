import React from "react";
import Link from "next/link";
import { Typography } from "@material-ui/core";
function TagList({ data }) {
  return data.map((tag, i) => (
    <Link href="t/[tag]" as={`/t/${tag.name}`} passHref key={i}>
      <a>
        <Typography>#{tag.name}</Typography>
      </a>
    </Link>
  ));
}

export default TagList;
