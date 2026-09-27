import { apiClient } from "../../../shared/api/api-client";
import type { ApiResponse } from "../../../shared/types/api";
import type { User } from "../model/types";

export async function fetchUsers(): Promise<User[]> {
  const response = await apiClient.get<ApiResponse<{ users: User[] }>>("/users");
  return response.data.data.users;
}