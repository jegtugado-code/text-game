import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

interface User {
  id: string;
  email: string;
  passwordHash: string; // salt:hash
}

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
