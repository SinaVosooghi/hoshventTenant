import Category from "./Category";
import User from "./User";

export default interface Blog {
  id: string;
  slug: string;
  title: string;
  metatitle: string;
  metadescription: string;
  image: string;
  category: Category;
  created: Date;
  updated: Date;
  body: string;
  user: User;
  author: User;
}
