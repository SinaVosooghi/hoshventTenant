import Category from "./Category";
import Hall from "./Hall";
import User from "./User";

export default interface Workshop {
  id: number;
  slug: string;
  title: string;
  body: string;
  price: number;
  offprice: number;
  lecturers: [User];
  seotitle: string;
  image: string;
  seobody: string;
  start_date: Date;
  end_date: Date;
  featured: boolean;
  status: boolean;
  created: Date;
  updated: Date;
  hall: Hall;
  capacity?: number;
  duration: string;
  site: any
}
