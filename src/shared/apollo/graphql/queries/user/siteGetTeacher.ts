import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetTeacher = gql`
  query getTeacher($id: Int!) {
    getTeacher(id: $id) {
      id
      username
      firstName
      lastName
      about
      avatar
      title
      twitter
      instagram
      linkedin
      whatsapp
      firstNameen
      lastNameen
      category {
        title
        titleen
      }
      follows {
        id
      }
      attendees {
        id
      }
      lessons {
        id
      }
      courses {
        id
        title
        image
        slug
        price
        offprice
        duration
        organizer {
          firstName
          lastName
        }
      }
    }
  }
`;

export default graphql(siteGetTeacher);
