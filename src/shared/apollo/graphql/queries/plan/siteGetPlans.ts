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
        sections {
          title
          lessons {
            order
            lesson {
              id
              title
              duration
              excerpt
              type
              public
              order
              body
              seotitle
              seobody
              conferenceoptions {
                startdate
                enddate
                password
                joinanytime
                host
                requireauth
                joinlink
                starturl
              }
              videooptions {
                type
                video
                link
                width
              }
              user {
                id
                firstName
                lastName
              }
              course {
                id
                title
              }
              slug
              featured
              status
              created
              updated
            }
          }
        }
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
