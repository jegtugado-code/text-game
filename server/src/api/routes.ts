import { Router } from 'express';

import { register } from './controllers/auth.controller';

export const registerRouter = Router();

registerRouter.post('/register', register);
