export type User = {
  id: number; // database user id
  userID: string; // socket id
  username: string;
  sessions?: number;
  self?: boolean;
  messages?: { content: string; fromSelf: boolean }[];
};