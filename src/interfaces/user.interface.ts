import { User } from '@prisma/client';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  isConfirmed: boolean;
  photoURL?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserResponse {
  status: boolean;
  data: IUser[] | null;
  message: string;
}

export interface AuthData {
  data: IUser | null;
  token: string;
}
