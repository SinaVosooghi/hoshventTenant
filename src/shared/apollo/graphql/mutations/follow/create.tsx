import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteCreateFollow = gql`
  mutation createFollow($input: CreateFollowInput!) {
    createFollow(input: $input)
  }
`;

export default graphql(siteCreateFollow);
