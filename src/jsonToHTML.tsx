import { makeStyles } from "@material-ui/core";
import React, { JSXElementConstructor } from "react";
import LazyLoad from "react-lazyload";
const useStyles = (props) => {
  return makeStyles((theme) => ({
    image_tool__imagepicture: {
      maxWidth: props.withBackground ? "60%" : "100%",
      verticalAlign: "bottom",
      display: "block",

      margin: props.withBackground && "0 auto",
    },
    ce_block__content: {
      position: "relative",
      maxWidth: props.stretched ? "none" : "650px",
      margin: "0 auto",
      transition: "background-color .15s ease",
      padding: ".4em 0",
    },
    image_tool__image: {
      borderRadius: "3px",
      overflow: "hidden",
      marginBottom: "10px",
      padding: props.withBackground && "15px",
      background: props.withBackground && theme.palette.background.paper,
    },

    image_tool__caption: {
      border: "1px solid rgba(201,201,204,.48)",
      borderRadius: "3px",
      padding: "10px 12px",
      outline: "none",
      width: "100%",
      boxSizing: "border-box",
    },
  }));
};

export const jsonToHTML = (post) =>
  post.content.map((el, i) => parseBlock(el, i));

function parseBlock(block: any, index: number) {
  const classes = useStyles({
    stretched: block.data?.stretched,
    withBackground: block.data?.withBackground,
  })();
  let el = null;
  switch (block.type) {
    case "image":
      el = (
        <React.Fragment>
          <div className={classes.image_tool__image}>
            <LazyLoad>
              <img
                className={classes.image_tool__imagepicture}
                src={block.data.file.url}
              />
            </LazyLoad>
          </div>
          {block.data.caption && (
            <div className={classes.image_tool__caption}>
              {block.data.caption}
            </div>
          )}
        </React.Fragment>
      );
      break;
    case "paragraph":
      el = <p>{block.data.text}</p>;
      break;
    case "heading":
      const { level, text } = block.data;
      const Heading: any = `h${level}`;
      el = <Heading>{text}</Heading>;
      break;
    case "embed":
      el = (
        <React.Fragment>
          <iframe
            height={block.data.height}
            frameBorder="0"
            allowFullScreen
            src={block.data.embed}
            width="100%"
          ></iframe>
          {block.data.caption && (
            <div className={classes.image_tool__caption}>
              {block.data.caption}
            </div>
          )}
        </React.Fragment>
      );
      break;
    // case "image":
    //   break;
    // case "image":
    //   break;

    default:
      el = <div></div>;
      break;
  }
  return (
    <div className={classes.ce_block__content} key={index}>
      {el}
    </div>
  );
}
