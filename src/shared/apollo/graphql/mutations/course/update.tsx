import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteUpdateCourse = gql`
  mutation updateCourse($input: UpdateCourseInput!) {
    updateCourse(input: $input) {
      id
    }
  }
`;

export default graphql(siteUpdateCourse);
