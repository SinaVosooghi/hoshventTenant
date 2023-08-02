import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetPlan = gql`
  query plan($id: Int!) {
    plan(id: $id) {
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
