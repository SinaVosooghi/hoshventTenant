import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteBuyCourse = gql`
  mutation buyCourseApi($input: BuyCourseInput!) {
    buyCourseApi(input: $input)
  }
`;

export default graphql(siteBuyCourse);
