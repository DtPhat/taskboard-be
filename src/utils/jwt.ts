import jwt, { SignOptions } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';


export function signJwt(payload: string | object | Buffer, expiresIn = '7d' as const): string {
  const options: SignOptions = { expiresIn};
  return jwt.sign(payload, JWT_SECRET, options);
}