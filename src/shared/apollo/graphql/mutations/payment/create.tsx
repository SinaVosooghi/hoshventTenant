import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteCreatePayment = gql`
  mutation doPayment($input: CreatePaymentInput!) {
    doPayment(input: $input)
  }
`;

export default graphql(siteCreatePayment);
