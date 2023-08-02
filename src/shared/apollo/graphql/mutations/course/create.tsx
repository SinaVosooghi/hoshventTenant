import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteCreateCourse = gql`
  mutation createCourseApi($input: CreateCourseInput!) {
    createCourseApi(input: $input) {
      id
    }
  }
`;

export default graphql(siteCreateCourse);
