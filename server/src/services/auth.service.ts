import type { User } from "../models/user.model";
import { UserRepository } from "../repositories/user.repository";
import { AppError } from "../utils/app-error";
import { generateToken } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/password";
import { UserService } from "./user.service";

export interface LoginResult {
  token: string;
  user: User;
}

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
  ) {}

  async register(input: unknown): Promise<User> {
    const body = requireObject(input);
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = normalizeEmail(body.email);
    const password = validatePassword(body.password);

    if (name.length < 1 || name.length > 100) {
      throw new AppError("Name must be between 1 and 100 characters", 400);
    }
    if (!isEmail(email)) {
      throw new AppError("A valid email is required", 400);
    }
    if (await this.userRepository.findByEmail(email)) {
      throw new AppError("Email is already registered", 409);
    }

    const passwordHash = await hashPassword(password);
    return this.userRepository.create({ name, email, passwordHash });
  }

  async login(input: unknown): Promise<LoginResult> {
    const body = requireObject(input);
    const email = normalizeEmail(body.email);
    const password = typeof body.password === "string" ? body.password : "";
    if (!isEmail(email) || password.length === 0) {
      throw new AppError("Invalid email or password", 401);
    }

    const userWithPassword = await this.userRepository.findByEmail(email);
    if (
      !userWithPassword ||
      !(await comparePassword(password, userWithPassword.passwordHash))
    ) {
      throw new AppError("Invalid email or password", 401);
    }

    const user = await this.userService.getUserById(userWithPassword.id);
    return { token: generateToken(user.id), user };
  }

  getCurrentUser(id: number): Promise<User> {
    return this.userService.getUserById(id);
  }
}

function requireObject(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new AppError("Request body must be a JSON object", 400);
  }
  return value as Record<string, unknown>;
}

function normalizeEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validatePassword(value: unknown): string {
  if (
    typeof value !== "string" ||
    value.length < 8 ||
    Buffer.byteLength(value, "utf8") > 72
  ) {
    throw new AppError(
      "Password must be at least 8 characters and at most 72 bytes",
      400,
    );
  }
  return value;
}
