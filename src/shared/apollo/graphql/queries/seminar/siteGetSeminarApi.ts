import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetSeminarApi = gql`
  query seminarApi($slug: String!) {
    seminarApi(slug: $slug) {
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

export default graphql(siteGetSeminarApi);
