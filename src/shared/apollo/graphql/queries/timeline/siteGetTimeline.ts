import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetTimeline = gql`
  query timeline($input: GetUserTimelineArgs!) {
    timeline(input: $input) {
        id
        created
        updated
        status
        user {
            id
            username
            firstName
            lastName
            mobilenumber
            usertype
            email
            created
        }
        service{
          id
          title
        }
        workshop {
            id
            title
            slug
            price
            body
            start_date
            }
            seminar {
            id
            title
            slug
            price
            body
            start_date
         
            }
          status
          created
          updated
    }
  }
`;

export default graphql(siteGetTimeline);
