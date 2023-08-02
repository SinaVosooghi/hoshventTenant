import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetTeachersPayments = gql`
  query teacherPaymentsApi($input: GetPaymentsArgs!) {
    teacherPaymentsApi(input: $input) {
      payments {
        id
        refid
        authority
        statusCode
        amount
        updated
        created
        type
        paymentmethod
        paymentMethodId
        amount
        status
        course {
          id
          slug
          title
        }
        user {
          id
          email
          firstName
          lastName
          usertype
          updated
          mobilenumber
          created
          status
        }
      }
      count
    }
  }
`;

export default graphql(siteGetTeachersPayments);
