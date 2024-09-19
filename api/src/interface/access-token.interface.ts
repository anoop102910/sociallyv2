import { ITokenBase } from './token-base.interface';

export interface IAccessPayload {
  userId: number;
}

export interface IAccessToken extends IAccessPayload, ITokenBase {}
