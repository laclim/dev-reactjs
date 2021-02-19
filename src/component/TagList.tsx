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
      <ScrollMenu
        data={list}
        arrowLeft={ArrowLeft}
        arrowRight={ArrowRight}
        scrollToSelected={false}
        translate={0}
        transition={0.3}
        innerWrapperStyle={
          {
            // transform: "translate3d(0.148438px, 0px, 0px)",
            // textAlign: "left",
            // transition: "transform 0.4s ease 0s",
            // whiteSpace: "nowrap",
          }
        }
      ></ScrollMenu>
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
