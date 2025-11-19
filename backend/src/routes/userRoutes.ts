import express from "express";
import { registerUser, loginUser, toggleFavorite } from "../controllers/userController";
import { protect } from "../middleware/auth";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.put("/favorites", protect, toggleFavorite);

export default router;