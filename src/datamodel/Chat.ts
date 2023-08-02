import Message from "./Message";
import User from "./User";

export default interface Chat {
  id: number;
  priority: "high" | "medium" | "low";
  type: "alert" | "success" | "info" | "warning" | "invoice";
  from: User;
  to: User;
  subject: string;
  status: boolean;
  messages: Message[];
  starred: boolean;
  repliable: boolean;
  closed: boolean;
  from_read: Date;
  to_read: Date;
  created: Date;
  updated: Date;
}
