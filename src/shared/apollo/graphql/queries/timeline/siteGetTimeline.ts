import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetTimeline = gql`
  query timeline($url: String!) {
    timeline(url: $url) {
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
        event {
          id
          title
          duration
          capacity
          video
          price
          offprice
          image
          slug
          category {
            title
          }
          halls{
        id
        title
        body
        workshops {
            id
            title
            slug
            price
            body
            start_date
            }
            seminars {
            id
            title
            slug
            price
            body
            start_date
            }
        }
          start_date
          featured
          status
          created
          updated
        }
    }
  }
`;

export default graphql(siteGetTimeline);
