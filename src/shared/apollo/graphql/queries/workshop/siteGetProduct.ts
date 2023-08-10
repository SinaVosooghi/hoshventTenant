import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetCourse = gql`
  query course($id: Int!) {
    course(id: $id) {
      id
      title
      seotitle
      image
      duration
      capacity
      video
      price
      offprice
      classlink
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
      prerequisite {
        title
      }
      organizer {
        id
        firstName
        lastName
      }
      attendees {
        id
      }
      slug
      body
      seobody
      category {
        id
        title
      }
      featured
      status
      created
      updated
    }
  }
`;

export default graphql(siteGetCourse);
