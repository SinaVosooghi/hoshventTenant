import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetServices = gql`
  query servicesApi($input: GetServicesArgs!) {
    servicesApi(input: $input) {
      services {
        id
        title
        body
        price
      }
      count
    }
  }
`;

export default graphql(siteGetServices);
