import { IUser } from "./user.interface";

export interface IBlacklistedToken {
  tokenId: string;
  user: IUser;
  createdAt: Date;
}