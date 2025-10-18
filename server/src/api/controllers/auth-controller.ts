import { before, GET, POST, route } from 'awilix-express';
import { Request, Response } from 'express';
import { z } from 'zod';

import { IAuthService } from '../../services/auth-service';
import { ITokenService } from '../../services/token-service';
import authMiddleware from '../middlewares/auth-middleware';

const authSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export interface AuthControllerDeps {
  authService: IAuthService;
  tokenService: ITokenService;
}

@route('/api/auth')
export default class AuthController {
  private readonly authService: IAuthService;
  private readonly tokenService: ITokenService;

  constructor({ authService, tokenService }: AuthControllerDeps) {
    this.authService = authService;
    this.tokenService = tokenService;
  }

  @route('/register')
  @POST()
  public async registerAction(req: Request, res: Response) {
    try {
      // Validate the request body
      const body = authSchema.parse(req.body);

      // The service layer contains the core business logic (hashing password, saving user).
      const created = await this.authService.createUser(
        body.email,
        body.password
      );

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
      console.log(err);
      // Generic error for anything else
      return res.status(500).json({ message: 'Internal error.' });
    }
  }

  @route('/login')
  @POST()
  public async loginAction(req: Request, res: Response) {
    try {
      // Validate the request body
      const body = authSchema.parse(req.body);

      // Attempt to log the user in using the service function
      const user = await this.authService.login(body.email, body.password);

      // If the service returns null, credentials were incorrect
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const accessToken = this.tokenService.generateToken(user);

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

  @before([authMiddleware])
  @route('/secure')
  @GET()
  public secureAction(req: Request, res: Response) {
    return res.status(200).json({
      message: 'Secured.',
    });
  }
}
