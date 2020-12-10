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
} from "@material-ui/core";
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import MLink from "@material-ui/core/Link";
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
        showReply: false,
        replyCommentContent: "",
      }));
      setCommentList([...commentList, ...cdata]);
    }
  }, [data]);
  useEffect(() => {
    console.log("sadas");
  }, [commentList]);

  const loadMoreComment = () => {
    setSkip(skip + 5);
  };
  const [addComment] = useMutation(ADD_COMMENT);
  const handleAddComment = () => {
    addComment({ variables: { content: parentComment, post: postID } }).then(
      (res) => {
        console.log(res);
        setCommentList([res.data.createComment, ...commentList]);
        setParentComment("");
      }
    );
  };
  const setCommentReplyTrue = (id) => {
    const d = commentList.map((el) => {
      if (el.id === id)
        return {
          ...el,
          showReply: true,
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
    console.log(d);
    setCommentList(d);
  };
  const sendReplyComment = (id, val) => {
    addComment({
      variables: { content: val, post: postID, parentComment: id },
    }).then((res) => {
      const d = commentList.map((el) => {
        if (el.id === id)
          return {
            ...el,
            childComment: [...el.childComment, res.data.createComment],
            contentReply: "",
            showReply: false,
          };
        return {
          ...el,
        };
      });
      console.log(d);
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
      <Box display="flex" justifyContent="flex-end" m={1} p={1}>
        <Button variant="contained" color="primary" onClick={handleAddComment}>
          <SendIcon />
        </Button>
      </Box>
      {commentList &&
        commentList.map((el) => (
          <React.Fragment key={el.id}>
            <Box display="flex">
              <Box p={1}>
                <Avatar
                  src={getS3Image(el.createdBy.profileImage, 150, 150)}
                  className={classes.avatarParentComment}
                />
              </Box>
              <Box p={1} width="100%">
                <Paper variant="outlined" className={classes.paper}>
                  <Link href="/" passHref>
                    <a>
                      <Typography variant="body2">
                        {el.createdBy.name}
                      </Typography>
                    </a>
                  </Link>
                  {el.content}
                </Paper>
                <Box>
                  <MLink
                    component="button"
                    onClick={() => setCommentReplyTrue(el.id)}
                  >
                    reply
                  </MLink>
                  {" . "}
                  <Typography variant="caption">
                    {dayjs().to(dayjs(el.createdAt))}
                  </Typography>
                </Box>
                {el.showReply && (
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
                    <Button
                      onClick={() => sendReplyComment(el.id, el.contentReply)}
                    >
                      <SendIcon />
                    </Button>
                  </React.Fragment>
                )}
              </Box>
            </Box>

            {el.childComment &&
              el.childComment.length > 0 &&
              el.childComment.map((childComment) => (
                <Box
                  display="flex"
                  alignItems="top"
                  marginLeft={4}
                  key={childComment.id}
                >
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
                  <Box p={1} width="100%">
                    <Paper variant="outlined" className={classes.paper}>
                      <Link href="/" passHref>
                        <a>
                          <Typography variant="body2">
                            {childComment.createdBy.name}
                          </Typography>
                        </a>
                      </Link>
                      {childComment.content}
                    </Paper>
                    <Typography variant="caption">
                      {dayjs().to(dayjs(childComment.createdAt))}
                    </Typography>
                  </Box>
                </Box>
              ))}
          </React.Fragment>
        ))}
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
