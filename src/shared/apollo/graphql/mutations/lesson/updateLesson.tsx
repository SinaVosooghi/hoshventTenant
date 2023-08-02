import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteUpdateLesson = gql`
  mutation updateLesson($input: UpdateLessonInput!) {
    updateLesson(input: $input) {
      id
    }
  }
`;

export default graphql(siteUpdateLesson);
