import Category from "./Category";
import User from "./User";

export default interface Service {
  id: string;
  slug: string;
  title: string;
  body: string;
  price: number;
}
