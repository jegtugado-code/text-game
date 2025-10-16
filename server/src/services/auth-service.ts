import { randomBytes, scrypt as _scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

import { User } from '../models/user';

const scrypt = promisify(_scrypt);

const users = new Map<string, User>();

export async function createUser(
  email: string,
  password: string
): Promise<boolean> {
  const normalized = email.toLowerCase();
  if (users.has(normalized)) return false;

  const salt = randomBytes(16).toString('hex');
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  const hash = `${salt}:${derived.toString('hex')}`;

  const user: User = {
    id: String(Date.now()),
    email: normalized,
    passwordHash: hash,
  };

  users.set(normalized, user);
  return true;
}

export function getUser(email: string): User | undefined {
  return users.get(email.toLowerCase());
}

/**
 * Verifies a user's credentials and returns the user object on success.
 * @param email The user's email.
 * @param password The user's password.
 * @returns A Promise that resolves to the User object or null if authentication fails.
 */
export async function login(
  email: string,
  password: string
): Promise<User | null> {
  // 1. Find the user by their email
  const user = getUser(email);
  if (!user) {
    return null; // User not found
  }

  // 2. Extract the salt and the stored hash from the passwordHash string
  const [salt, storedHash] = user.passwordHash.split(':');

  // 3. Hash the provided password using the same salt
  const derivedAttempt = (await scrypt(password, salt, 64)) as Buffer;
  const suppliedHash = derivedAttempt.toString('hex');

  // 4. Securely compare the supplied hash with the stored hash
  // We use Buffer and timingSafeEqual to prevent timing attacks 🔒
  const storedHashBuffer = Buffer.from(storedHash, 'hex');
  const suppliedHashBuffer = Buffer.from(suppliedHash, 'hex');

  if (storedHashBuffer.length !== suppliedHashBuffer.length) {
    return null;
  }

  const passwordsMatch = timingSafeEqual(storedHashBuffer, suppliedHashBuffer);

  // 5. Return the user object if the passwords match, otherwise return null
  return passwordsMatch ? user : null;
}
