import { Request, Response } from 'express';
import { z } from 'zod';

import { createUser, login } from '../../services/auth-service';
import { generateToken } from '../../services/token-service';

const authSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export async function registerAction(req: Request, res: Response) {
  try {
    // Validate the request body
    const body = authSchema.parse(req.body);

    // The service layer contains the core business logic (hashing password, saving user).
    const created = await createUser(body.email, body.password);

    // If 'created' is false, it means the user already exists.
    if (!created) {
      // Send a 409 Conflict status code, as the request conflicts with existing data.
      return res.status(409).json({ message: 'User already exists.' });
    }

    // If user creation was successful, send a 201 Created status code.
    return res.status(201).json({ message: 'User created.' });
  } catch (err) {
    // Check if the error is a validation error from Zod.
    if (err instanceof z.ZodError) {
      // If so, send a 400 Bad Request status with the specific validation issues.
      return res.status(400).json({ errors: err.issues });
    }
    // Generic error for anything else
    return res.status(500).json({ message: 'Internal error.' });
  }
}

export async function loginAction(req: Request, res: Response) {
  try {
    // Validate the request body
    const body = authSchema.parse(req.body);

    // Attempt to log the user in using the service function
    const user = await login(body.email, body.password);

    // If the service returns null, credentials were incorrect
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const accessToken = generateToken(user);

    // On successful login, send back some user data (but NOT the password hash)
    // In a real app, you would generate and send a JWT here. 🔑
    return res.status(200).json({
      message: 'Login successful.',
      accessToken,
    });
  } catch (err) {
    // Check if the error is a validation error from Zod.
    if (err instanceof z.ZodError) {
      // If so, send a 400 Bad Request status with the specific validation issues.
      return res.status(400).json({ errors: err.issues });
    }
    console.error((err as Error).message);
    // Generic error for anything else
    return res.status(500).json({ message: 'Internal error.' });
  }
}
