import type { Response, NextFunction } from 'express';

import { verifyToken } from '../../services/token-service';
import { RequestWithUser } from '../types';

/**
 * Express middleware that checks for a valid JWT in the Authorization header.
 */
export function authenticate(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // Attach decoded claims to the request for downstream access
    req.user = decoded;

    next();
  } catch (err) {
    if (err instanceof Error) {
      console.error('Authentication error:', err.message);
      return res.status(401).json({ error: err.message || 'Unauthorized' });
    }
  }
}
