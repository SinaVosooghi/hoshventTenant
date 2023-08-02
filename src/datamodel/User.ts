export default interface User {
  id: number;
  avatar: string;
  uid: number;
  firstName: string;
  lastName: string;
  fullName: string;
  token: string;
  email: string;
  mobilenumber: number;
  username: string;
  userType: string;
  access_token: string;
  type: "teacher" | "student";
  about: string;
}
