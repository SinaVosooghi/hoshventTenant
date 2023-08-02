import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetComments = gql`
  query commentsApi($input: GetCommentsArgs!) {
    commentsApi(input: $input) {
      comments {
        id
        user {
          id
          firstName
          lastName
        }
        created
        updated
      }
      count
    }
  }
`;

export default graphql(siteGetComments);
