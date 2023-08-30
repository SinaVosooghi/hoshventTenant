import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetMenus = gql`
  query menusApi($input: GetMenusArgs!) {
    menusApi(input: $input) {
      menus {
        id
        title
        link
      }
      count
    }
  }
`;

export default graphql(siteGetMenus);
