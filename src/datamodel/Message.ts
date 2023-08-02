import Chat from "./Chat";
import User from "./User";

export default interface Message {
  id: number;
  chat: Chat;
  body: string;
  read: Date;
  user: User;
  status: boolean;
  created: Date;
  updated: Date;
}
