import express from "express";
import { getMyProfile } from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getMyProfile);

export default router;
