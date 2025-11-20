import { Router } from "express";
import {
  createSpa,
  deleteSpa,
  getSpaConfig,
  getSpas,
  updateSpa,
} from "../controllers/spaController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/config/:spaId", getSpaConfig);

router.use(authenticate);
router.get("/", getSpas);
router.post("/", createSpa);
router.put("/:id", updateSpa);
router.delete("/:id", deleteSpa);

export default router;

