import type { Message } from "../models/message.model";
import { MessageRepository } from "../repositories/message.repository";
import { UserRepository } from "../repositories/user.repository";
import { AppError } from "../utils/app-error";

export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getConversation(
    currentUserId: number,
    otherUserIdInput: string | number,
  ): Promise<Message[]> {
    const otherUserId = parseUserId(otherUserIdInput);
    if (otherUserId === currentUserId) {
      throw new AppError("Cannot load a conversation with yourself", 400);
    }
    if (!(await this.userRepository.findById(otherUserId))) {
      throw new AppError("User not found", 404);
    }
    return this.messageRepository.findConversation(currentUserId, otherUserId);
  }

  async sendMessage(
    senderId: number,
    receiverIdInput: unknown,
    contentInput: unknown,
  ): Promise<Message> {
    const receiverId = parseUserId(receiverIdInput);
    if (receiverId === senderId) {
      throw new AppError("Cannot send a message to yourself", 400);
    }
    if (
      typeof contentInput !== "string" ||
      contentInput.trim().length === 0 ||
      contentInput.length > 5000
    ) {
      throw new AppError(
        "Message content must be between 1 and 5000 characters",
        400,
      );
    }
    if (!(await this.userRepository.findById(receiverId))) {
      throw new AppError("Receiver not found", 404);
    }
    return this.messageRepository.create(
      senderId,
      receiverId,
      contentInput.trim(),
    );
  }
}

function parseUserId(value: unknown): number {
  const id =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new AppError("Invalid user id", 400);
  }
  return id;
}
