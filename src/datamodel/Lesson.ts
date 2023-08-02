import User from "./User";

export default interface Lesson {
  id: number;
  title: string;
  duration: string;
  slug: string;
  seobody: string;
  seotitle: string;
  type: "text" | "video" | "slide" | "conference";
  body: string;
  excerpt: string;
  order: number;
  videooptions: any;
  conferenceoptions: any;
  image: string;
  featured: boolean;
  public: boolean;
  course: any;
  user: User;
  status: boolean;
  created: Date;
  updated: Date;
}
