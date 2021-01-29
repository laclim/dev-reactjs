import {
  makeStyles,
  Theme,
  createStyles,
  fade,
  TextFieldProps,
  TextField,
  OutlinedInputProps,
  Button,
  Box,
  Paper,
  Avatar,
  Typography,
  Divider,
} from "@material-ui/core";
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

dayjs.extend(relativeTime);

const GET_COMMENT = gql`
  query getComment($id: ID, $limit: Int, $skip: Int) {
    comments(id: $id, limit: $limit, skip: $skip) {
      results {
        id
        childComment {
          id
          content
          createdAt
          createdBy {
            name
            profileImage
          }
        }
        createdAt
        content
        createdBy {
          name
          profileImage
        }
      }
      pageInfo {
        hasNext
      }
    }
  }
`;

const ADD_COMMENT = gql`
  mutation createComment($content: String!, $post: ID!, $parentComment: ID) {
    createComment(
      input: { content: $content, post: $post, parentComment: $parentComment }
    ) {
      id
      content
      createdBy {
        name
        profileImage
      }
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    borderRadius: theme.spacing(2),
  },
  avatarParentComment: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  avatarChildComment: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(1),
  },
  replyComment: {
    boxSizing: "border-box",
    position: "absolute",
    width: 3,
    left: 2,
    bottom: 10,
    top: 5,
    backgroundColor: "#e6e7e8",
  },
  replyCommentContent: {
    marginBottom: 8,
  },
  userLink: {
    display: "inline-block",
    cursor: "pointer",
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
  userLinkText: {
    fontSize: theme.spacing(2),
    fontWeight: 700,
  },
  divider: {
    marginTop: 4,
    marginBottom: 8,
  },
}));

import React, { useEffect } from "react";
import SendIcon from "@material-ui/icons/Send";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { getS3Image } from "../helper";
import { useState } from "react";
function Comment({ postID }) {
  const [skip, setSkip] = useState(0);
  const [getComments, { loading, error, data }] = useLazyQuery(GET_COMMENT);
  const [commentList, setCommentList] = useState([]);
  const [parentComment, setParentComment] = useState("");
  useEffect(() => {
    getComments({
      variables: { id: postID, limit: 5, skip: skip },
    });
  }, [skip]);
  useEffect(() => {
    if (data) {
      let cdata = [...data.comments.results];

      cdata = cdata.map((item) => ({
        ...item,
        status: false,
        replyCommentContent: "",
      }));
      setCommentList([...commentList, ...cdata]);
    }
  }, [loading]);

  const loadMoreComment = () => {
    setSkip(skip + 5);
  };
  const [addComment] = useMutation(ADD_COMMENT);
  const handleAddComment = () => {
    addComment({ variables: { content: parentComment, post: postID } }).then(
      (res) => {
        setCommentList([res.data.createComment, ...commentList]);
        setParentComment("");
      }
    );
  };
  const setCommentReplyTextField = (id, status) => {
    const d = commentList.map((el) => {
      if (el.id === id)
        return {
          ...el,
          status,
        };
      return {
        ...el,
      };
    });

    setCommentList(d);
  };
  const setCommentReplyContent = (id, val) => {
    const d = commentList.map((el) => {
      if (el.id === id)
        return {
          ...el,
          contentReply: val,
        };
      return {
        ...el,
      };
    });
    setCommentList(d);
  };
  const sendReplyComment = (id, val) => {
    addComment({
      variables: { content: val, post: postID, parentComment: id },
    }).then((res) => {
      const d = commentList.map((el) => {
        if (el.id === id && el?.childComment)
          return {
            ...el,
            childComment: [...el?.childComment, res.data.createComment],
            contentReply: "",
            status: false,
          };
        else if (el.id === id && !el?.childComment)
          return {
            ...el,
            childComment: [res.data.createComment],
            contentReply: "",
            status: false,
          };
        else
          return {
            ...el,
          };
      });
      setCommentList(d);
    });
  };
  const classes = useStyles();
  return (
    <React.Fragment>
      <h2>Comment</h2>
      <RedditTextField
        variant="filled"
        fullWidth
        rowsMax="3"
        multiline
        value={parentComment}
        onChange={(e) => setParentComment(e.target.value)}
      />
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={handleAddComment}
        >
          Comment
        </Button>
      </Box>
      {commentList?.length > 0 ? (
        <Paper variant="outlined" style={{ padding: 8 }}>
          {commentList.map((el, i) => (
            <React.Fragment key={el.id}>
              <Box display="flex">
                <Box p={1}>
                  <Avatar
                    src={getS3Image(el.createdBy.profileImage, 150, 150)}
                    className={classes.avatarParentComment}
                  />
                </Box>
                <Box width="100%" marginX={1}>
                  <Box display="flex">
                    <Link href="/" passHref>
                      <a className={classes.userLink}>
                        <Typography className={classes.userLinkText}>
                          {el.createdBy.name}
                        </Typography>
                      </a>
                    </Link>
                    <Box ml={1}>
                      <Typography color="secondary">
                        {dayjs().to(dayjs(el.createdAt))}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography>{el.content}</Typography>
                  </Box>

                  <Box>
                    <Button
                      color="secondary"
                      size="small"
                      onClick={() => setCommentReplyTextField(el.id, true)}
                    >
                      reply
                    </Button>
                  </Box>
                  {el.status && (
                    <React.Fragment>
                      <RedditTextField
                        variant="filled"
                        fullWidth
                        rowsMax="2"
                        multiline
                        value={el.contentReply}
                        onChange={(e) =>
                          setCommentReplyContent(el.id, e.target.value)
                        }
                      />
                      <Box display="flex" justifyContent="flex-end">
                        <Button
                          className={classes.button}
                          onClick={() => setCommentReplyTextField(el.id, false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          className={classes.button}
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            sendReplyComment(el.id, el.contentReply)
                          }
                        >
                          Reply
                        </Button>
                      </Box>
                    </React.Fragment>
                  )}
                </Box>
              </Box>

              {el.childComment &&
                el.childComment.length > 0 &&
                el.childComment.map((childComment, childCommentIndex) => (
                  <Box
                    display="flex"
                    alignItems="top"
                    marginLeft={4}
                    marginRight={1}
                    key={childComment.id}
                    style={{ position: "relative" }}
                  >
                    <Box className={classes.replyComment} />
                    <Box p={1}>
                      <Avatar
                        className={classes.avatarChildComment}
                        src={getS3Image(
                          childComment.createdBy.profileImage,
                          150,
                          150
                        )}
                      />
                    </Box>
                    <Box>
                      <Box display="flex">
                        <Link href="/" passHref>
                          <a className={classes.userLink}>
                            <Typography className={classes.userLinkText}>
                              {childComment.createdBy.name}
                            </Typography>
                          </a>
                        </Link>
                        <Box ml={1}>
                          <Typography color="secondary">
                            {dayjs().to(dayjs(childComment.createdAt))}
                          </Typography>
                        </Box>
                      </Box>

                      <Box className={classes.replyCommentContent}>
                        <Typography> {childComment.content}</Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              {i + 1 !== commentList.length && (
                <Divider light className={classes.divider} />
              )}
            </React.Fragment>
          ))}
        </Paper>
      ) : (
        <Typography color="secondary">Be the first one to comment</Typography>
      )}

      {data && data.comments.pageInfo.hasNext && (
        <Button onClick={loadMoreComment}>load more</Button>
      )}
    </React.Fragment>
  );
}

export default Comment;

const useStylesReddit = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      border: "1px solid #e2e2e1",
      overflow: "hidden",
      borderRadius: 4,
      backgroundColor: "#fcfcfb",
      transition: theme.transitions.create(["border-color", "box-shadow"]),
      "&:hover": {
        backgroundColor: "#fff",
      },
      "&$focused": {
        backgroundColor: "#fff",
        boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
        borderColor: theme.palette.primary.main,
      },
    },
    focused: {},
  })
);

function RedditTextField(props: TextFieldProps) {
  const classes = useStylesReddit();

  return (
    <TextField
      InputProps={
        { classes, disableUnderline: true } as Partial<OutlinedInputProps>
      }
      {...props}
    />
  );
}
