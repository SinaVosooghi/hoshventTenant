import Category from "./Category";
import CourseSection from "./CourseSection";
import User from "./User";

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
  favorite: any[];
  like: any[];
  reviews: any[];
}
