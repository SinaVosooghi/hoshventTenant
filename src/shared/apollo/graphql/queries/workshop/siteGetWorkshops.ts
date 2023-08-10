import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetWorkshops = gql`
  query workshopsApi($input: GetWorkshopsArgs!) {
    workshopsApi(input: $input) {
      workshops {
        id
        title
        seotitle
        image
        price
        slug
        body
        seobody
        start_date
        end_date
        hall {
          title
        }
        lecturers {
          id
          firstName
        }
        featured
        status
        created
        updated
      }
      count
    }
  }
`;

export default graphql(siteGetWorkshops);
