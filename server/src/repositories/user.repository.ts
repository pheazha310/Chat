import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { database } from "../config/database";
import type { User, UserWithPassword } from "../models/user.model";
import { AppError } from "../utils/app-error";

interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const PUBLIC_COLUMNS =
  "id, name, email, created_at AS createdAt, updated_at AS updatedAt";
const USER_COLUMNS = `${PUBLIC_COLUMNS}, password_hash AS passwordHash`;

export class UserRepository {
  async findByEmail(email: string): Promise<UserWithPassword | null> {
    const [rows] = await database.execute<UserRow[]>(
      `SELECT ${USER_COLUMNS} FROM users WHERE email = ? LIMIT 1`,
      [email],
    );
    return rows[0] ?? null;
  }

  async findById(id: number): Promise<User | null> {
    const [rows] = await database.execute<UserRow[]>(
      `SELECT ${PUBLIC_COLUMNS} FROM users WHERE id = ? LIMIT 1`,
      [id],
    );
    return rows[0] ?? null;
  }

  async findAllExcept(id: number): Promise<User[]> {
    const [rows] = await database.execute<UserRow[]>(
      `SELECT ${PUBLIC_COLUMNS} FROM users WHERE id <> ? ORDER BY id ASC`,
      [id],
    );
    return rows;
  }

  async create(input: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<User> {
    try {
      const [result] = await database.execute<ResultSetHeader>(
        "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
        [input.name, input.email, input.passwordHash],
      );
      const user = await this.findById(result.insertId);
      if (!user) {
        throw new Error("Created user could not be loaded");
      }
      return user;
    } catch (error) {
      if (isDatabaseError(error) && error.code === "ER_DUP_ENTRY") {
        throw new AppError("Email is already registered", 409);
      }
      throw error;
    }
  }
}

function isDatabaseError(error: unknown): error is Error & { code?: string } {
  return error instanceof Error && "code" in error;
}
