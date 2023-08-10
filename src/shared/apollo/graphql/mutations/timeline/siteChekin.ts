import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteCheckin = gql`
  mutation checkin($aid: Int!,  $id: Int!, $type: String!) {
    checkin(id: $id, aid: $aid, type: $type) 
  }
`;

export default graphql(siteCheckin);
