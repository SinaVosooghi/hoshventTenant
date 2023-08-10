import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteCheckout = gql`
  mutation checkout($aid: Int!,  $id: Int!, $type: String!) {
    checkout(id: $id, aid: $aid, type: $type) 
  }
`;

export default graphql(siteCheckout);
