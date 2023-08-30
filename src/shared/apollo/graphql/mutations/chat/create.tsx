import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteCreateChat = gql`
  mutation createUserChatApi($input: CreateChatInput!) {
    createUserChatApi(input: $input)
  }
`;

export default graphql(siteCreateChat);
