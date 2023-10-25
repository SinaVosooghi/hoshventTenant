import Category from "./Category";
import User from "./User";

export default interface Service {
  id: string;
  slug: string;
  title: string;
  body: string;
  price: number;
  workshops: any;
  seminars: any;
  image:string;
  start_date: Date;
  end_date: Date;
}
