import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteCreateChat = gql`
  mutation CreateChat($input: CreateChatInput!) {
    createChat(input: $input)
  }
`;

export default graphql(siteCreateChat);
