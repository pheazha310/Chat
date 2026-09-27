import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { sendSuccess } from "../utils/response";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (request: Request, response: Response): Promise<void> => {
    const user = await this.authService.register(request.body);
    sendSuccess(response, 201, { user }, "Account created");
  };

  login = async (request: Request, response: Response): Promise<void> => {
    const result = await this.authService.login(request.body);
    sendSuccess(response, 200, result);
  };

  me = async (request: Request, response: Response): Promise<void> => {
    const user = await this.authService.getCurrentUser(request.user!.id);
    sendSuccess(response, 200, { user });
  };
}
