import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetService = gql`
  query serviceApi($id: Int!) {
    serviceApi(id: $id) {
        id
        title
        body
        price
        image
        start_date
        end_date
    }
  }
`;

export default graphql(siteGetService);
