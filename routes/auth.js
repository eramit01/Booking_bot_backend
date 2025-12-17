import { Router } from "express";
import { login } from "../controllers/authController.js";

const router = Router();

// USER LOGIN
router.post("/login", login);

// ADMIN LOGIN
// router.post("/login", adminLogin);

export default router;
