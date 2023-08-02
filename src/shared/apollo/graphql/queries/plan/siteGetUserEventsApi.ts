import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetUserCoursesApi = gql`
  query userCoursesApi($input: GetCoursesArgs!) {
    userCoursesApi(input: $input) {
      attends {
        id
        created
        updated
        status
        course {
          id
          title
          duration
          capacity
          video
          price
          offprice
          image
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
          slug
          category {
            title
          }
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

export default graphql(siteGetUserCoursesApi);
