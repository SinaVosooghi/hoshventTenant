import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetLessons = gql`
  query lessons($input: GetLessonsArgs!) {
    lessons(input: $input) {
      lessons {
        id
        title
        duration
        excerpt
        public
        user {
          id
          firstName
          lastName
        }
        course {
          id
          title
        }
        conferenceoptions {
          joinlink
          starturl
          startdate
        }
        type
        slug
        featured
        status
        created
        updated
      }
      count
    }
  }
`;

export default graphql(siteGetLessons);
