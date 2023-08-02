import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetChats = gql`
  query chatsApi($input: GetChatsArgs!) {
    chatsApi(input: $input) {
      chats {
        id
        subject
        status
        from {
          id
          firstName
          lastName
        }
        invoice {
          id
          invoicenumber
          total
        }
        department {
          id
          title
        }
        messages {
          body
          created
        }
        repliable
        closed
        priority
        type
        starred
        created
        updated
        from_read
        to_read
      }
      count
    }
  }
`;

export default graphql(siteGetChats);
