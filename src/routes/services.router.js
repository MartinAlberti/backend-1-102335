import { Router } from "express";
// Controllers
import {
  createService,
  deleteService,
  getServiceById,
  getServices,
  updateService
} from "../controllers/services.controller.js";
// Services

const router = Router();

//GET "/api/services"
router.get("", getServices);
//GET "/api/services/:id"
router.get("/:id", getServiceById);
//POST "/api/services"
router.post("", createService);
//PUT "/api/services/_ID"

router.put("/:sid",updateService);
//DELETE "/api/services/:id"
router.delete("/:id", deleteService);

export default router;
