import { Router } from "express";
import { MessageController } from "../controllers/message.controller";
import { authenticate } from "../middleware/auth.middleware";
import { MessageRepository } from "../repositories/message.repository";
import { UserRepository } from "../repositories/user.repository";
import { MessageService } from "../services/message.service";

const messageService = new MessageService(
  new MessageRepository(),
  new UserRepository(),
);
const messageController = new MessageController(messageService);
const router = Router();

router.use(authenticate);
router.get("/:userId", messageController.history);

export default router;
