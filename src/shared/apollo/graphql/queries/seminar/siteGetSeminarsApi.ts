import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetSminarsApi = gql`
  query seminarsApi($input: GetSeminarsArgs!) {
    seminarsApi(input: $input) {
      seminars {
        id
        title
        seotitle
        image
        price
        slug
        capacity
        body
        seobody
        start_date
        end_date
        hall {
          title
        }
        featured
        status
        created
        updated
      }
      count
    }
  }
`;

export default graphql(siteGetSminarsApi);
