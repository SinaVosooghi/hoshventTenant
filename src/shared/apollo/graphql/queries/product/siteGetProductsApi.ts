import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetProductsApi = gql`
  query productsApi($input: GetProductsArgs!) {
    productsApi(input: $input) {
      products {
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
          title
        }
        featured
        status
        created
        updated
        quantity
      }
      count
    }
  }
`;

export default graphql(siteGetProductsApi);
