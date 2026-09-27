import { apiClient } from "../../../shared/api/api-client";
import type { User } from "../../../entities/user/model/types";
import type { ApiResponse } from "../../../shared/types/api";

export interface AuthResult {
  token: string;
  user: User;
}

export async function signIn(
  email: string,
  password: string,
): Promise<AuthResult> {
  const response = await apiClient.post<ApiResponse<AuthResult>>(
    "/auth/login",
    { email, password },
  );
  return response.data.data;
}

export async function signUp(
  name: string,
  email: string,
  password: string,
): Promise<User> {
  const response = await apiClient.post<ApiResponse<{ user: User }>>(
    "/auth/register",
    { name, email, password },
  );
  return response.data.data.user;
}