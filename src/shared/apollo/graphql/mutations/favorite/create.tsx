import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteCreateFavorite = gql`
  mutation createFavorite($input: CreateFavoriteInput!) {
    createFavorite(input: $input) {
      id
    }
  }
`;

export default graphql(siteCreateFavorite);
