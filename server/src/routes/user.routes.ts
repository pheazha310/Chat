import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";

const userController = new UserController(
  new UserService(new UserRepository()),
);
const router = Router();

router.use(authenticate);
router.get("/", userController.list);
router.get("/:id", userController.getById);

export default router;
