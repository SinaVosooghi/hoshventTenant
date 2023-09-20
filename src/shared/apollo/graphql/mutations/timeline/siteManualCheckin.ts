import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteManualCheckin = gql`
  mutation manualCheckin($input: ManualCheckinInput!) {
    manualCheckin(input: $input) 
  }
`;

export default graphql(siteManualCheckin);
