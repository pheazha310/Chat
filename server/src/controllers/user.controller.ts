import type { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { sendSuccess } from "../utils/response";

export class UserController {
  constructor(private readonly userService: UserService) {}

  list = async (request: Request, response: Response): Promise<void> => {
    const users = await this.userService.listOtherUsers(request.user!.id);
    sendSuccess(response, 200, { users });
  };

  getById = async (request: Request, response: Response): Promise<void> => {
    const user = await this.userService.getUserById(String(request.params.id));
    sendSuccess(response, 200, { user });
  };
}
