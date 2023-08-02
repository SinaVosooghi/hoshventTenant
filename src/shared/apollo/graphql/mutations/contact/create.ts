import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteCreateContact = gql`
  mutation createContact($input: CreateContactInput!) {
    createContact(input: $input) {
      id
    }
  }
`;

export default graphql(siteCreateContact);
