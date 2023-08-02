import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetSetting = gql`
  query getSetting {
    getSetting {
      title
      companyName
      address
      phoneNumber
      keywords
      email
      logo
      logo_second
      favicon
      description
      seodescription
      policy
      contact
      about
      faq
      currency
      maintenance
      copyright
      tax
      workinghours
      whatsapp
      twitter
      instagram
      linkedin
      youtube
      facebook
      support
    }
  }
`;

export default graphql(siteGetSetting);
