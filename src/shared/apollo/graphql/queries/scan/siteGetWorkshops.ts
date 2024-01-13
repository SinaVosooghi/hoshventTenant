import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetScans = gql`
  query scans($input: GetScansArgs!) {
    scans(input: $input) {
      scans {
        id
        workshop {
          title
        }
        seminar {
          title
        }
        user {
          firstName
          lastName
        }
        checkin
        checkout
        created
        updated
      }
      count
    }
  }
`;

export default graphql(siteGetScans);
