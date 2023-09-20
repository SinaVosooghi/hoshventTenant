import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetWorkshopApi = gql`
  query workshopApi($slug: String!) {
    workshopApi(slug: $slug) {
      id
      title
      seotitle
      image
      price
      slug
      body
      seobody
      start_date
      end_date
      hall {
        title
        event {
          id
          slug
        }
      }
      lecturers {
        id
        firstName
      }
      services {
        id
        title
        price
      }
      featured
      status
      created
      updated
    }
  }
`;

export default graphql(siteGetWorkshopApi);
