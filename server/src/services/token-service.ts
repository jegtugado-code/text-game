import { User } from '@prisma/client';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { EnvConfigType } from 'src/env-config';
import { v7 } from 'uuid';

export interface ITokenService {
  generateToken: (user: User) => string;
  verifyToken: (accessToken: string) => JwtPayload;
}

export type { JwtPayload };

export default class TokenService implements ITokenService {
  private readonly envConfig: EnvConfigType;

  constructor({ envConfig }: { envConfig: EnvConfigType }) {
    this.envConfig = envConfig;
  }

  public generateToken(user: User) {
    if (!this.envConfig.jwt.secret) {
      throw new Error('Server configuration error.');
    }
    const payload = {
      email: user.email,
      // You could add other non-sensitive data like roles here, e.g., 'role': 'user'
    };
    const jwtid = v7();
    const expiresIn = this.envConfig.jwt.expiresIn;
    const options: jwt.SignOptions = {
      expiresIn: expiresIn,
      subject: user.id,
      issuer: this.envConfig.jwt.issuer,
      audience: this.envConfig.jwt.audience,
      jwtid: jwtid,
    };
    const accessToken = jwt.sign(payload, this.envConfig.jwt.secret, options);

    return accessToken;
  }

  public verifyToken(token: string) {
    if (!this.envConfig.jwt.secret) {
      throw new Error('Server configuration error.');
    }

    try {
      const decoded = jwt.verify(token, this.envConfig.jwt.secret, {
        issuer: this.envConfig.jwt.issuer,
        audience: this.envConfig.jwt.audience,
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
}
