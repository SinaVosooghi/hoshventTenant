import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetToken = gql`
  query getToken($slug: String!) {
    getToken(slug: $slug)
  }
`;

export default graphql(siteGetToken);
