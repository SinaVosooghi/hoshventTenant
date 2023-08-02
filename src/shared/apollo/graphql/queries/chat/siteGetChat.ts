import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetChat = gql`
  query chatApi($id: Int!) {
    chatApi(id: $id) {
      id
      subject
      status
      from {
        id
        firstName
        lastName
        email
      }
      to {
        id
        firstName
        lastName
        email
      }
      invoice {
        id
        invoicenumber
        total
      }
      messages {
        id
        body
        created
        user {
          id
          firstName
          lastName
          email
          created
        }
      }
      type
      priority
      repliable
      closed
      starred
      created
      updated
    }
  }
`;

export default graphql(siteGetChat);
