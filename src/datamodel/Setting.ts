export default interface Setting {
  title: string;
  companyName: string;
  address: string;
  phoneNumber: string;
  keywords: string;
  email: string;
  logo: string;
  logo_second: string;
  favicon: string;
  description: string;
  seodescription: string;
  about: string;
  contact: string;
  faq: string;
  tax: number;
  copyright: string;
  policy: string;
  maintenance?: boolean;
  courseQuestion: { questions: [{ title: string }] };
  blogQuestion: { questions: [{ title: string }] };
  productQuestion: { questions: [{ title: string }] };
  currency: string;
  cardlayout: string
}
