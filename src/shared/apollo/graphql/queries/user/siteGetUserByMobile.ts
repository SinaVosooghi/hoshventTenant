import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetUserByMobileNumber = gql`
  query userByMobile($input: GetUserMobileApiArgs!) {
    userByMobile(input: $input) {
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
      seminars {
        id
        title
      }
      workshops {
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

export default graphql(siteGetUserByMobileNumber);
