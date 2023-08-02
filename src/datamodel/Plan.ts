import Category from "./Category";
import User from "./User";

export default interface Plan {
  id: string;
  slug: string;
  title: string;
  body: string;
  price: number;
  sms: number;
  services: [{ title: string; id: number }];
}
