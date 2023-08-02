import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetPayments = gql`
  query paymentsApi($input: GetPaymentsArgs!) {
    paymentsApi(input: $input) {
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
        products {
          title
          qty
        }
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

export default graphql(siteGetPayments);
