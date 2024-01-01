import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetAttendees = gql`
  query attendeesApi($input: GetAttendeesArgs!) {
    attendeesApi(input: $input) {
      attends {
        id
        workshop {
          id
          title
          seotitle
          image
          price
          slug
          featured
          status
          created
          updated
        }
        seminar {
          id
          title
          seotitle
          image
          price
          slug
          featured
          status
          created
          updated
        }
        user {
          id
          email
          firstName
          lastName
          usertype
          updated
          mobilenumber
          created
          status
        }
      }
      count
    }
  }
`;

export default graphql(siteGetAttendees);
