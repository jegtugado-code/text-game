import { Request, Response } from 'express';
import { z } from 'zod';

import { createUser } from '../../services/auth.service';

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export async function register(req: Request, res: Response) {
  try {
    const body = registerSchema.parse(req.body);

    const created = await createUser(body.email, body.password);

    if (!created) {
      return res.status(409).json({ message: 'User already exists' });
    }

    return res.status(201).json({ message: 'User created' });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.issues });
    }
    return res.status(500).json({ message: 'Internal error' });
  }
}
