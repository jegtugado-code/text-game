import jwt from 'jsonwebtoken';
import { v7 } from 'uuid';

import { User } from '../models/user';

const jwtSecret = process.env.JWT_SECRET;

/**
 * Generate a signed JWT for a given user.
 */
export function generateToken(user: User) {
  if (!jwtSecret) {
    console.error('JWT_SECRET environment variable not set!');
    throw new Error('Server configuration error.');
  }
  const payload = {
    email: user.email,
    // You could add other non-sensitive data like roles here, e.g., 'role': 'user'
  };
  const jwtid = v7();
  const expiresIn = (process.env.JWT_EXPIRES_IN ?? 3600) as number;
  const options: jwt.SignOptions = {
    expiresIn: expiresIn,
    subject: user.id,
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
    jwtid: jwtid,
  };
  const accessToken = jwt.sign(payload, jwtSecret, options);

  return accessToken;
}

/**
 * Verify a JWT and return the decoded claims if valid.
 * Throws an error if invalid or expired.
 */
export function verifyToken(token: string) {
  if (!jwtSecret) {
    console.error('JWT_SECRET environment variable not set!');
    throw new Error('Server configuration error.');
  }

  try {
    const decoded = jwt.verify(token, jwtSecret, {
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
    });

    // decoded will contain all standard and custom claims
    return decoded as jwt.JwtPayload;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired');
    }
    if (err instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw err;
  }
}
