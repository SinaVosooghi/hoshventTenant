import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteCreateReview = gql`
  mutation createReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      id
    }
  }
`;

export default graphql(siteCreateReview);
