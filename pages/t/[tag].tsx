import { GetServerSideProps } from "next";
import React from "react";

function TagName(props) {
  const { tag } = props;
  return <React.Fragment>HI {tag}</React.Fragment>;
}

export default TagName;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { tag } = context.params;
  return {
    props: {
      tag,
    },
  };
};
