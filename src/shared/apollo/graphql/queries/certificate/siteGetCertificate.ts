import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetCertificate = gql`
  query getCertificate($type: String!) {
    getCertificate(type: $type) {
      id
      image
      created
      title
      type
      itemLayout
    }
  }
`;

export default graphql(siteGetCertificate);
