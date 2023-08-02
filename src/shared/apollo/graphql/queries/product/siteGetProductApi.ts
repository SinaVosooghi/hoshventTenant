import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetProductApi = gql`
  query productApi($slug: String!) {
    productApi(slug: $slug) {
      id
      title
      seotitle
      image
      price
      offprice
      slug
      body
      seobody
      category {
        id
        title
        slug
      }
      featured
      hascomment
      status
      created
      updated
      quantity
      variations {
        idx
        value
        variation {
          title
          value
        }
      }
    }
  }
`;

export default graphql(siteGetProductApi);
