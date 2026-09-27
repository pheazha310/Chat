import type { Request, Response } from "express";
import { MessageService } from "../services/message.service";
import { sendSuccess } from "../utils/response";

export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  history = async (request: Request, response: Response): Promise<void> => {
    const messages = await this.messageService.getConversation(
      request.user!.id,
      String(request.params.userId),
    );
    sendSuccess(response, 200, { messages });
  };
}
