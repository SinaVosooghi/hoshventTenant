import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetCoupon = gql`
  query couponApi($input: GetCouponArgs!) {
    couponApi(input: $input) {
      id
      title
      code
      percent
    }
  }
`;

export default graphql(siteGetCoupon);
