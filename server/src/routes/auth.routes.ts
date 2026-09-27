import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { UserRepository } from "../repositories/user.repository";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const authController = new AuthController(
  new AuthService(userRepository, userService),
);
const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authenticate, authController.me);

export default router;
