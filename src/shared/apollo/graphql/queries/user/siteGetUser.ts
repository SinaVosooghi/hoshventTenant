import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetUser = gql`
  query user($id: Int!) {
    user(id: $id) {
      id
      email
      address
      username
      title
      titleen
      firstName
      lastName
      mobilenumber
      phonenumber
      usertype
      status
      about
      avatar
      firstNameen
      lastNameen
      category {
        title
        titleen
        category {
          title
        }
      }
      seminars {
        id
        title
      }
      workshops {
        id
        title
      }
      services {
        id
        title
      }
      role {
        id
        title
      }
    }
  }
`;

export default graphql(siteGetUser);
