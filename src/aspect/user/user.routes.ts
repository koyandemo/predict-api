import { Router } from "express";
import { loginUserController, registerUserController } from "./user.controller";
import prisma from "../../prisma";

const router = Router();

router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

router.post("/register", registerUserController);
router.post("/login", loginUserController);

export default router;
