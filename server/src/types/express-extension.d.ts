import * as jwt from 'jsonwebtoken';

// Augment the Request interface from the 'express-serve-static-core' module
declare global {
  namespace Express {
    interface Request {
      user?: jwt.JwtPayload;
    }
  }
}
