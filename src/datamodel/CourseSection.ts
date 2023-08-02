import Category from "./Category";
import User from "./User";

export default interface CourseSection {
  idx: number;
  title: string;
}

export default interface Course {
  id: number;
  slug: string;
  title: string;
  body: string;
  seobody: string;
  seotitle: string;
  image: string;
  duration: string;
  capacity: number;
  video: string;
  classlink: string;
  price: number;
  offprice: number;
  prerequisite: [string];
  organizer: User;
  attendees: any[];
  sections: CourseSection[];
  featured: boolean;
  category: Category;
  status: boolean;
  created: Date;
  updated: Date;
}
