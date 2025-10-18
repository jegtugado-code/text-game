import { makeInvoker } from 'awilix-express';
import type { Request, Response, NextFunction } from 'express';

import { ITokenService } from '../../services/token-service';

/**
 * Express middleware that checks for a valid JWT in the Authorization header.
 * Uses awilix-express makeInvoker for dependency injection.
 * @param tokenService The TokenService dependency (injected by awilix).
 */
const authMiddleware =
  ({ tokenService }: { tokenService: ITokenService }) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader?.startsWith('Bearer ')) {
        return res
          .status(401)
          .json({ error: 'Missing or invalid Authorization header' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = tokenService.verifyToken(token);

      // Attach decoded claims to the request for downstream access
      req.user = decoded;

      next();
    } catch (err) {
      if (err instanceof Error) {
        console.error('Authentication error:', err.message);
        return res.status(401).json({ error: err.message || 'Unauthorized' });
      }
    }
  };

export default makeInvoker(authMiddleware);
