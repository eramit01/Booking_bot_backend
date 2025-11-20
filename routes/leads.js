import { Router } from "express";
import { createLead, getLeads } from "../controllers/leadController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post("/", createLead);
router.get("/", authenticate, getLeads);

export default router;

