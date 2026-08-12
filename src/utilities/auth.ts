import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { IUser } from '../interface/user/User';

export function signToken(id: string): string {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

export function sanitizeUser(user: IUser): Omit<IUser, 'password'> {
  const obj = user.toObject();
  delete obj.password;
  return obj;
}
