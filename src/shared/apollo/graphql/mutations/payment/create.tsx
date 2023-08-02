import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteCreatePayment = gql`
  mutation createPayment($input: CreatePaymentInput!) {
    createPayment(input: $input)
  }
`;

export default graphql(siteCreatePayment);
