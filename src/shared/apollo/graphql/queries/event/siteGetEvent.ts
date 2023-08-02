import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetEvent = gql`
  query event($id: Int!) {
    event(id: $id) {
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

export default graphql(siteGetEvent);
