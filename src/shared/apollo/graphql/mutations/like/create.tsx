import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteCreateLike = gql`
  mutation createLike($input: CreateLikeInput!) {
    createLike(input: $input) {
      id
    }
  }
`;

export default graphql(siteCreateLike);
