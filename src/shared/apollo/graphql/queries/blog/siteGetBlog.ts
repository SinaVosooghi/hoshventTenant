import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetBlog = gql`
  query blogApi($slug: String!) {
    blogApi(slug: $slug) {
      id
      title
      body
      status
      featured
      image
      created
      updated
      slug
      seotitle
      seobody
      readtime
      likes {
        like
      }
      author {
        firstName
        lastName
      }
      category {
        id
        title
      }
    }
  }
`;

export default graphql(siteGetBlog);
