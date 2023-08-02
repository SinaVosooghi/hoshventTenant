import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetUser = gql`
  query user($id: Int!) {
    user(id: $id) {
      id
      email
      address
      username
      firstName
      lastName
      mobilenumber
      phonenumber
      usertype
      status
      about
      avatar
      role {
        id
        title
      }
    }
  }
`;

export default graphql(siteGetUser);
