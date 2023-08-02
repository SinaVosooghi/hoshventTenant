import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteCheckFollow = gql`
  query checkFollow($teacher: Int!) {
    checkFollow(teacher: $teacher)
  }
`;

export default graphql(siteCheckFollow);
