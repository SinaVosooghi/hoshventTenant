import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetBlogs = gql`
  query blogsApi($input: GetBlogsArgs!) {
    blogsApi(input: $input) {
      blogs {
        id
        title
        image
        slug
        category {
          title
        }
        author {
          firstName
          lastName
        }
        featured
        status
        created
        updated
      }
      count
    }
  }
`;

export default graphql(siteGetBlogs);
