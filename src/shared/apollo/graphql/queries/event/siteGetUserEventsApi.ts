import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetUserEventsApi = gql`
  query userEventsApi($input: GetEventsArgs!) {
    userEventsApi(input: $input) {
      attends {
        id
        created
        updated
        status
        workshop {
          id
          title
          capacity
          price
          image
          slug
          start_date
          end_date
          featured
          status
          created
          updated
        }
        seminar {
          id
          title
          capacity
          price
          image
          slug
          start_date
          end_date
          featured
          status
          created
          updated
        }
      }
      count
    }
  }
`;

export default graphql(siteGetUserEventsApi);
