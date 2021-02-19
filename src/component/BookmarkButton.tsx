import { IconButton } from "@material-ui/core";
import React from "react";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import TurnedInIcon from "@material-ui/icons/TurnedIn";
import { useState } from "react";

import { gql, useLazyQuery, useMutation } from "@apollo/client";
const BOOKMARK_POST = gql`
  mutation bookmarkPost($id: ID!, $pull: Boolean) {
    bookmarkPost(id: $id, pull: $pull)
  }
`;

function BookmarkButton({ isBookmarked, postID }) {
  const [turnedIn, setTurnedIn] = useState(isBookmarked);
  const [bookmarkPost] = useMutation(BOOKMARK_POST);
  const handleBookmark = (postID) => {
    bookmarkPost({ variables: { id: postID } }).then(() => {
      setTurnedIn(true);
    });
  };
  const handleUnbookmark = (postID) => {
    bookmarkPost({ variables: { id: postID, pull: true } }).then(() => {
      setTurnedIn(false);
    });
  };
  return (
    <React.Fragment>
      {turnedIn ? (
        <IconButton color="inherit" onClick={() => handleUnbookmark(postID)}>
          <TurnedInIcon />
        </IconButton>
      ) : (
        <IconButton onClick={() => handleBookmark(postID)}>
          <BookmarkBorderIcon />
        </IconButton>
      )}
    </React.Fragment>
  );
}
export default BookmarkButton;
