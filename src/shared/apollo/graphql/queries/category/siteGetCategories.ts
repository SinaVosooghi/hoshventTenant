import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetCategories = gql`
  query categoriesApi($input: GetCategoriesArgs!) {
    categoriesApi(input: $input) {
      categories {
        id
        title
        type
        image
        slug
        category {
          title
          slug
        }
        status
        created
        updated
      }
      count
    }
  }
`;

export default graphql(siteGetCategories);
