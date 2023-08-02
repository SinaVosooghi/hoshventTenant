import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetBrands = gql`
  query brandsApi($input: GetBrandsArgs!) {
    brandsApi(input: $input) {
      brands {
        id
        image
      }
      count
    }
  }
`;

export default graphql(siteGetBrands);
