import { Router } from "express";
import { getPresignedUrl } from "./file.controller";

const router = Router();

router.post('/presigned-url',getPresignedUrl);

export default router;