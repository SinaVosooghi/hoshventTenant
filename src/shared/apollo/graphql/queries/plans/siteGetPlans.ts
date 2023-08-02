import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetPlans = gql`
  query plansApi($input: GetPlansArgs!) {
    plansApi(input: $input) {
      plans {
        id
        title
        slug
        body
        sms
        price
        services {
          title
        }
      }
      count
    }
  }
`;

export default graphql(siteGetPlans);
