import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetEventApi = gql`
  query eventApi($slug: String!) {
    eventApi(slug: $slug) {
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
      start_date
      end_date
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
        }
        seminars {
          id
          title
          slug
          price
          body
        }
      }
      featured
      status
      created
      updated
    }
  }
`;

export default graphql(siteGetEventApi);
