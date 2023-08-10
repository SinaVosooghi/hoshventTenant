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
      slug
      body
      seobody
      category {
        id
        title
      }
      halls{
        id
        title
        body
        workshops {
          id
          title
          slug
          price
          body
          start_date
        }
        seminars {
          id
          title
          slug
          price
          body
          start_date
        }
      }
      featured
      status
      created
      updated
    }
  }
`;

export default graphql(siteGetEvent);
