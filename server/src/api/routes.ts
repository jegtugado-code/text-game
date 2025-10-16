import { Router } from 'express';

import { loginAction, registerAction } from './controllers/auth-controller';

export const registerRouter = Router();

registerRouter.post('/register', registerAction);
registerRouter.post('/login', loginAction);
