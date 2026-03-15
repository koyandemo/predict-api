import { Router } from "express";
import {
  loginUserController,
  registerUserController,
  registerWithProviderController,
  updateUserProfileController,
} from "./user.controller";

const router = Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.post("/register-provider", registerWithProviderController);
router.put("/profile/key", updateUserProfileController);

export default router;
