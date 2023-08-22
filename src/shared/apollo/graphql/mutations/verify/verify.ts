import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";
export const sitePaymentVerification = gql`
  mutation verification($input: VerificationInput!) {
    verification(input: $input)
  }
`;
export default graphql(sitePaymentVerification);