import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetTimelines = gql`
  query timelines($input: GetTimelinsArgs!) {
    timelines(input: $input) {
      timelines {
        id
        user {
          id
          firstName
          lastName
          mobilenumber
        }
        workshop {
          id
          title
          slug
          hall {
            event {
              title
              image
            }
          }
        }
        seminar {
          id
          title
          slug
          hall {
            event {
              title
              image
            }
          }
        }
        service {
          id
          title
        }
        checkin
        checkout
        created
        updated
      }
      count
      total
    }
  }
`;

export default graphql(siteGetTimelines);
