import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteCreateLesson = gql`
  mutation createLessonApi($input: CreateLessonInput!) {
    createLessonApi(input: $input) {
      id
    }
  }
`;

export default graphql(siteCreateLesson);
