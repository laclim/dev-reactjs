import React from "react";
import Link from "next/link";
import { Box, Typography, Paper } from "@material-ui/core";
import { SignalWifi1BarLockSharp } from "@material-ui/icons";
import ScrollMenu from "react-horizontal-scrolling-menu";
import { useState, useEffect } from "react";
function TagList({ data }) {
  const [list, setList] = useState([]);
  // const [list, setList] = useState([]);
  useEffect(() => {
    const a = data?.map((tag, i) => {
      return <Tag tag={tag} key={i}></Tag>;
    });
    setList(a);
  }, []);

  return (
    <React.Fragment>
      <Box display="flex" flexWrap="wrap">
        {data?.map((tag, i) => (
          <React.Fragment>
            <Tag tag={tag} key={i}></Tag>
          </React.Fragment>
        ))}
      </Box>
    </React.Fragment>
  );
}

function Tag({ tag }) {
  return (
    <Paper style={{ borderRadius: 16, padding: 8, margin: 4 }}>
      <Link href="t/[tag]" as={`/t/${tag.name}`} passHref>
        <a style={{ textDecoration: "none", color: "#000000" }}>
          <Typography>{tag.name}</Typography>
        </a>
      </Link>
    </Paper>
  );
}

const Arrow = ({ text, className }) => {
  return <div className={className}>{text}</div>;
};

const ArrowLeft = Arrow({ text: "<", className: "arrow-prev" });
const ArrowRight = Arrow({ text: ">", className: "arrow-next" });

export default TagList;
