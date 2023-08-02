import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetStartUrl = gql`
  query lessonstarturl($id: Int!) {
    lessonstarturl(id: $id) {
      id
    }
  }
`;

export default graphql(siteGetStartUrl);
