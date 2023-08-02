export default interface Category {
  id: string;
  title: string;
  slug: string;
  seoDescription: string;
  descriptionTitle: string;
  description: string;
  path: string;
  image: string;
  icon: string;
  visibility: boolean;
  featured: boolean;
  created: Date;
  updated: Date;
}
