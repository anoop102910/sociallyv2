import { IUser } from "./user.interface";

export interface IAuthResult {
    user: IUser;
    accessToken: string;
    refreshToken: string;
  }