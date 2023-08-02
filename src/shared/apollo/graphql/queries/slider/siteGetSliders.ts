import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetSliders = gql`
  query slidersApi($input: GetSlidersArgs!) {
    slidersApi(input: $input) {
      sliders {
        id
        link
        image
        alt
        featured
      }
    }
  }
`;

export default graphql(siteGetSliders);
