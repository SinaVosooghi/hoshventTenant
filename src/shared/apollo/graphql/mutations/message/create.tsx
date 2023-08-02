import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteCreateMessage = gql`
  mutation createMessage($input: CreateMessageInput!) {
    createMessage(input: $input) {
      id
    }
  }
`;

export default graphql(siteCreateMessage);
