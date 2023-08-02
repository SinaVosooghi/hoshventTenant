import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteCheckAttend = gql`
  query checkCourseApi($id: Int!) {
    checkCourseApi(id: $id) {
      alreadyBought
      outOfCapacity
    }
  }
`;

export default graphql(siteCheckAttend);
