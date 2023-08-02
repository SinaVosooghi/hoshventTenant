import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetEventsApi = gql`
  query eventsApi($input: GetEventsArgs!) {
    eventsApi(input: $input) {
      events {
        id
        title
        capacity
        price
        image
        duration
        slug
        category {
          title
        }
        user {
          firstName
          lastName
        }
        featured
        start_date
        status
        created
        updated
      }
      count
    }
  }
`;

export default graphql(siteGetEventsApi);
