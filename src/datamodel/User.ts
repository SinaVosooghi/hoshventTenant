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
  accessToken: string;
  type: "instructor" | "user";
  about: string;
}
