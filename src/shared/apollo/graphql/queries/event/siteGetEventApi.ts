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

export default graphql(siteGetEventApi);
