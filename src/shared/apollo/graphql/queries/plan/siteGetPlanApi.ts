import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetPlanApi = gql`
  query planApi($slug: String!) {
    planApi(slug: $slug) {
      id
      title
      subtitle
      image
      price
      slug
      body
      services {
        id
        title
        body
      }
      status
      created
      updated
    }
  }
`;

export default graphql(siteGetPlanApi);
