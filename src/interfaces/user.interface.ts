import { User } from '@prisma/client';

export interface IUser extends User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface IUserResponse {
  status: boolean;
  data: IUser[] | IUser | null;
  message: string;
}

export interface AuthData {
  data: IUser | null;
  token: string;
}
