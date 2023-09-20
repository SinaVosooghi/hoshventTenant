import Category from "./Category";
import Service from "./Service";

export default interface Product {
  id: number;
  title: string;
  body: string;
  seobody: string;
  seotitle: string;
  slug: string;
  image: string[];
  price: number;
  quantity: number;
  offprice: number;
  featured: boolean;
  status: boolean;
  hascomment: boolean;
  qty: number;
  category: Category;
  created: Date;
  updated: Date;
  services: [Service];
}
