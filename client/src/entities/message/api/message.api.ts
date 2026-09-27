import { apiClient } from "../../../shared/api/api-client";
import type { ApiResponse } from "../../../shared/types/api";
import type { Message } from "../model/types";

/** Loads the chronological conversation between the current user and otherUser. */
export async function fetchHistory(otherUserId: number): Promise<Message[]> {
  const response = await apiClient.get<ApiResponse<{ messages: Message[] }>>(
    `/messages/${otherUserId}`,
  );
  return response.data.data.messages;
}