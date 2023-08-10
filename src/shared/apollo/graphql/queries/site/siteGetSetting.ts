import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetSite = gql`
  query getSite($id: Int!) {
    getSite(id: $id) {
      id
      title
      company
      phonenumber
      address
      city
      slug
      seobody
      seotitle
      body
      logo
      tax
    }
  }
`;

export default graphql(siteGetSite);
