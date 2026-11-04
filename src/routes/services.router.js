import { Router } from "express";
// Controllers
import {
  createService,
  deleteService,
  getServiceById,
  // getServices,
} from "../controllers/services.controller.js";
import ServiceManager from "../Managers/servicesManager.js";
import path from "node:path";
import { RESPONSES_STATUS } from "../constants/resStatus.js";

const DATABASE_NAME = "services.json";
const databasePath = path.join(
  import.meta.dirname,
  "..",
  "data",
  DATABASE_NAME,
);
const manager = new ServiceManager(databasePath);

// Controller
const getServices = async (req, res) => {
  try {
    const services = await manager.getServices();
    res.status(200).json({
      status: RESPONSES_STATUS.SUCCESS,
      payload: services,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: RESPONSES_STATUS.ERROR,
      message: "Error al obtener los servicios.",
    });
  }
};

//Router
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
