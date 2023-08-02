import gql from "graphql-tag";
import { graphql } from "@apollo/client/react/hoc";

export const siteGetLesson = gql`
  query lesson($id: Int!) {
    lesson(id: $id) {
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
        starturl
        requireauth
        schedule_for
        joinlink
        repeat_interval
        weekly_days
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

export default graphql(siteGetLesson);
