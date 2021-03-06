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
    link_tool__content: {
      display: "block",
      padding: "25px",
      borderRadius: "2px",
      boxShadow: "0 0 0 2px #fff",
      color: "initial !important",
      textDecoration: "none !important",
      background: "white",
    },
    link_tool__image: {
      backgroundPosition: "center center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      margin: "0 0 0 30px",
      width: "65px",
      height: "65px",
      borderRadius: "3px",
      float: "right",
    },
    link_tool__title: {
      fontSize: "17px",
      fontWeight: 600,
      lineHeight: "1.5em",
      margin: "0 0 10px 0",
    },
    link_tool__description: {
      margin: "0 0 20px 0",
      fontSize: "15px",
      lineHeight: "1.55em",
      display: "-webkit-box",
      WebkitLineClamp: 3,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    },
    link_tool__anchor: {
      display: "block",
      fontSize: "15px",
      lineHeight: "1em",
      color: "#888",
      border: 0,
      padding: 0,
    },
    cdx_list: {
      margin: 0,
      paddingLeft: "40px",
      outline: "none",
      listStyle: props.listStyle == "unordered" ? "disc" : "decimal",
    },
    cdx_list__item: {
      padding: "5.5px 0 5.5px 3px",
      lineHeight: "1.6em",
    },
    ce_code__textarea: {
      minHeight: "200px",
      fontFamily: "Menlo, Monaco, Consolas, Courier New, monospace",
      color: "#41314e",
      lineHeight: "1.6em",
      fontSize: "12px",
      background: "#f8f7fa",
      border: "1px solid #f1f1f4",
      boxShadow: "none",
      whiteSpace: "pre",
      wordWrap: "normal",
      overflowX: "auto",
      resize: "vertical",
      borderRadius: "3px",
      padding: "10px 12px",
      outline: "none",
      width: "100%",
      WebkitBoxSizing: "border-box",
    },
    cdx_block: {
      padding: ".4em 0",
    },
  }));
};

export const jsonToHTML = (post) => {
  if (post.content) return post.content.map((el, i) => parseBlock(el, i));
};

function parseBlock(block: any, index: number) {
  const classes = useStyles({
    stretched: block.data?.stretched,
    withBackground: block.data?.withBackground,
    listStyle: block.data?.style,
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
                src={block.data?.file?.url}
              />
            </LazyLoad>
          </div>
          {block.data.caption && (
            <div
              className={classes.image_tool__caption}
              dangerouslySetInnerHTML={createMarkup(block.data.caption)}
            />
          )}
        </React.Fragment>
      );
      break;
    case "paragraph":
      // el = <p>{block.data.text}</p>;
      el = <div dangerouslySetInnerHTML={createMarkup(block.data.text)}></div>;
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
            <div
              className={classes.image_tool__caption}
              dangerouslySetInnerHTML={createMarkup(block.data.caption)}
            />
          )}
        </React.Fragment>
      );
      break;
    case "linkTool":
      const domain = new URL(block.data.meta.url);
      el = (
        <React.Fragment>
          <a
            className={classes.link_tool__content}
            target="_blank"
            rel="nofollow noindex noreferrer"
            href={block?.data?.link}
          >
            <div
              className={classes.link_tool__image}
              style={{
                backgroundImage: `url(${block?.data?.meta?.image?.url})`,
              }}
            ></div>
            <div className={classes.link_tool__title}>
              {block.data.meta.title}
            </div>
            <p className={classes.link_tool__description}>
              {block.data.meta.description}
            </p>
            <span className={classes.link_tool__anchor}>{domain.hostname}</span>
          </a>
        </React.Fragment>
      );
      break;
    case "list":
      el = (
        <React.Fragment>
          <ul className={classes.cdx_list}>
            {block?.data?.items.map((el, i) => (
              <li key={i} className={classes.cdx_list__item}>
                <div dangerouslySetInnerHTML={createMarkup(el)}></div>
              </li>
            ))}
          </ul>
        </React.Fragment>
      );
      break;

    case "code":
      el = <div className={classes.ce_code__textarea}>{block.data?.code}</div>;
      break;
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

function createMarkup(data) {
  return { __html: data };
}
