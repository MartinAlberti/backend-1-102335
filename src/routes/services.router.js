import { Router } from "express";
// Controllers
import {
  createService,
  deleteService,
  getServiceById,
  getServices,
} from "../controllers/services.controller.js";
// Services

const router = Router();

//GET "/api/services"
router.get("", getServices);
//GET "/api/services/:id"
router.get("/:id", getServiceById);
//POST "/api/services"
router.post("", createService);
//DELETE "/api/services/:id"
router.delete("/:id", deleteService);

export default router;
