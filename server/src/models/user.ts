export interface User {
  id: string;
  email: string;
  passwordHash: string; // salt:hash
}
