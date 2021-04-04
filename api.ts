import { gql } from "@apollo/client";

export const PROFILE = gql`
  query($slug: String) {
    profile(slug: $slug) {
      email
      name
      profileImage
      biodata
      createdAt
      slug
      publishedPostCount
      link {
        github
        linkedIn
      }
      posts {
        id
        title
        createdAt
        updatedAt
        createdBy {
          name
          profileImage
        }
        slug
        content
        description
      }
    }
  }
`;
