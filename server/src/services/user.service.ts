import type { User } from "../models/user.model";
import { UserRepository } from "../repositories/user.repository";
import { AppError } from "../utils/app-error";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async listOtherUsers(currentUserId: number): Promise<User[]> {
    return this.userRepository.findAllExcept(currentUserId);
  }

  async getUserById(idInput: string | number): Promise<User> {
    const id = Number(idInput);
    if (!Number.isSafeInteger(id) || id < 1) {
      throw new AppError("Invalid user id", 400);
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }
}
