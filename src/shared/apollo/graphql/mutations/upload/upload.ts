import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteUploadImage = gql`
  mutation uploadImage($input: UploadImage!) {
    uploadImage(input: $input)
  }
`;

export default graphql(siteUploadImage);
