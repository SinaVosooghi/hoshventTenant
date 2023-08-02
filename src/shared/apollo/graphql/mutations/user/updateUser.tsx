import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteUpdateUser = gql`
  mutation updateUserApi($input: UpdateUserInput!) {
    updateUserApi(input: $input) {
      id
    }
  }
`;

export default graphql(siteUpdateUser);
