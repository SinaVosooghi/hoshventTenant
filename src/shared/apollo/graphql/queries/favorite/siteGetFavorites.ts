import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetFavorites = gql`
  query favorites($input: GetFavoritesArgs!) {
    favorites(input: $input) {
      favorites {
        id
        course {
          title
          slug
        }
        product {
          title
          slug
        }
        created
        updated
      }
      count
    }
  }
`;

export default graphql(siteGetFavorites);
