import Category from "./Category";
import CourseSection from "./CourseSection";
import User from "./User";

export default interface Hall {
  id: number;
  slug: string;
  title: string;
  body: string;
  image: string;
}
