import express from "express";
import { getPendingUsers, approveUser, rejectUser } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/pending", authMiddleware, requireRole("admin"), getPendingUsers);
router.patch("/:id/approve", authMiddleware, requireRole("admin"), approveUser);
router.patch("/:id/reject", authMiddleware, requireRole("admin"), rejectUser);

export default router;
