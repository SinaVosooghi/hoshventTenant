import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetReviews = gql`
  query reviewsApi($input: GetReviewsArgs!) {
    reviewsApi(input: $input) {
      reviews {
        id
        answers
        user {
          id
          firstName
          lastName
        }
        comment {
          id
          body
        }
        created
        updated
      }
      count
    }
  }
`;

export default graphql(siteGetReviews);
