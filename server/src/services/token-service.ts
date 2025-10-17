import jwt from 'jsonwebtoken';

import { User } from '../models/user';

export function generateToken(user: User) {
  // It's crucial this is not hard-coded in your application.
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    // If the secret is not configured, throw an error for security.
    console.error('JWT_SECRET environment variable not set!');
    throw new Error('Server configuration error.');
  }
  const payload = {
    id: user.id,
    email: user.email,
    // You could add other non-sensitive data like roles here, e.g., 'role': 'user'
  };
  const expiresIn = (process.env.JWT_EXPIRES_IN ?? 3600) as number;
  const options: jwt.SignOptions = {
    expiresIn: expiresIn,
    subject: user.id,
  };
  const accessToken = jwt.sign(payload, jwtSecret, options);

  return accessToken;
}
