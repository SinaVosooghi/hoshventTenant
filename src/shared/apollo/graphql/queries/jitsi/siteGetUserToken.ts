import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetUserToken = gql`
  query getUserToken($slug: String!) {
    getUserToken(slug: $slug)
  }
`;

export default graphql(siteGetUserToken);
