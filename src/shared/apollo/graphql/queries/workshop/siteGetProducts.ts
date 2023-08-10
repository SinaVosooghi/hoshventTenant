import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetCourses = gql`
  query courses($input: GetCoursesArgs!) {
    courses(input: $input) {
      courses {
        id
        title
        duration
        capacity
        video
        price
        offprice
        organizer {
          firstName
          lastName
        }
        attendees {
          id
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
        slug
        category {
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

export default graphql(siteGetCourses);
