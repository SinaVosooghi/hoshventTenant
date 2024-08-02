import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteCreatePrint = gql`
  mutation createPrint($input: CreatePrintInput!) {
    createPrint(input: $input) {
      id
    }
  }
`;

export default graphql(siteCreatePrint);
