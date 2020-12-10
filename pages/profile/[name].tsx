import { gql } from "@apollo/client/core";
import { GetServerSideProps } from "next";
import React from "react";
import { initializeApollo } from "../../src/component/config/apollo";
import Posts from "../../src/component/Posts";
import Error from "next/error";

const GET_USER = gql`
  query getUser($name: String!) {
    profile(name: $name) {
      id
      posts {
        id
        title
        createdAt
        updatedAt
        slug
        createdBy {
          name
        }
        content
      }
    }
  }
`;

function Profile(props) {
  const { profileData, errorCode } = props;

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }
  return (
    <React.Fragment>
      <Posts data={profileData.posts}></Posts>
    </React.Fragment>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Fetch data from external API

  const { name } = context.params;
  const apolloClient = initializeApollo();
  let profileData,
    errorCode = null;
  try {
    const data = await apolloClient.query({
      query: GET_USER,
      variables: { name },
    });

    profileData = data.data.profile;
    if (!profileData) errorCode = 404;
  } catch (error) {}

  return {
    props: {
      errorCode,
      profileData,
    },
  };
};

export default Profile;
