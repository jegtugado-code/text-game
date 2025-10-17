import type { Request } from 'express';
import type { JwtPayload } from 'jsonwebtoken';

export interface RequestWithUser extends Request {
  user?: JwtPayload;
}
