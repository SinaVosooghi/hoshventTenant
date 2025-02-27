import Category from "./Category";
import User from "./User";

export default interface Event {
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
  user: User;
  attendees: any[];
  featured: boolean;
  category: Category;
  status: boolean;
  created: Date;
  updated: Date;
  start_date: Date;
  favorite: any[];
  like: any[];
  reviews: any[];
  qty?: number
}
