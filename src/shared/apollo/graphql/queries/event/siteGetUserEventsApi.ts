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
        event {
          id
          title
          duration
          capacity
          video
          price
          offprice
          image
          slug
          category {
            title
          }
          start_date
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
