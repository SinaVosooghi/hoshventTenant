import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetLessonBySlug = gql`
  query lessonApi($slug: String!) {
    lessonApi(slug: $slug) {
      id
      title
      duration
      excerpt
      type
      public
      order
      body
      seotitle
      seobody
      duration
      image
      conferenceoptions {
        startdate
        enddate
        password
        joinanytime
        host
        requireauth
        schedule_for
      }
      videooptions {
        type
        video
        link
        width
      }
      user {
        id
        firstName
        lastName
      }
      course {
        id
        title
      }
      slug
      featured
      status
      created
      updated
    }
  }
`;

export default graphql(siteGetLessonBySlug);
