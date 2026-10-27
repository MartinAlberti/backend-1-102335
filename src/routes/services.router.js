import { Router } from "express";
import { RESPONSES_STATUS } from "../constants/resStatus.js";

import path from "node:path";
import ServiceManager from "../managers/servicesManager.js";

const DATABASE_NAME = "services.json";
const databasePath = path.join(
  import.meta.dirname,
  "..",
  "data",
  DATABASE_NAME,
);
const manager = new ServiceManager(databasePath);

const router = new Router();

router.get("/", async (req, res) => {
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
});

// obtener el recurso por id
router.get("/:sid", async (req, res) => {
  const id = Number(req.params.sid);
  if (!Number.isInteger(id) || id < 0) {
    
    return res.status(400).json({
      status: RESPONSES_STATUS.BAD_REQUEST,
      message: "El ID es invalido",
    });
  }
  try {
    const service = await manager.getServiceById(id);
    if (!service) {
      res.status(404).json({
        status: RESPONSES_STATUS.NOT_FOUND,
        message: "Servicio no encontrador",
      });
    }
    res.status(200).json({
      status: RESPONSES_STATUS.SUCCESS,
      payload: service,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: RESPONSES_STATUS.ERROR,
      message: "Error al obtener el servicio.",
    });
  }
});

// crear el servicio

router.post("/", async (req, res) => {
   try {
    const newService = await manager.addService(req.body);
    res.status(201).json({
      status: RESPONSES_STATUS.SUCCESS,
      payload: newService,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: RESPONSES_STATUS.ERROR,
      message: "Error al crear el servicio.",
    });
  }
});

// router.post("/", async (req, res) => {
//   try {
//     const newService = await manager.addService(req.body);

//     return res.status(201).json({
//       status: "success",
//       payload: newService
//     });
//   } catch (error) {
//     if (error.code === "VALIDATION_ERROR") {
//       return res.status(400).json({
//         status: "bad_request",
//         message: error.message
//       });
//     }

//     return res.status(500).json({
//       status: "error",
//       message: "Error interno del servidor"
//     });
//   }
// });

// Actualizar un servicio por su ID


router.put("/:sid", async (req, res) => {
  // Obtenemos el ID desde los parámetros de la URL
  const id = Number(req.params.sid);

  // Validamos que el ID sea un número entero positivo
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      status: RESPONSES_STATUS.BAD_REQUEST,
      message: "El ID es inválido",
    });
  }

  try {
    // Buscamos y actualizamos el servicio mediante el manager
    const updatedService = await manager.updateService(id, req.body);

    // Si el servicio no existe, respondemos con 404
    if (!updatedService) {
      return res.status(404).json({
        status: RESPONSES_STATUS.NOT_FOUND,
        message: "Servicio no encontrado",
      });
    }

    // Devolvemos el servicio actualizado
    return res.status(200).json({
      status: RESPONSES_STATUS.SUCCESS,
      message: "Servicio actualizado correctamente",
      payload: updatedService,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: RESPONSES_STATUS.ERROR,
      message: "Error al actualizar el servicio.",
    });
  }
});

// eliminar el servicio
router.delete("/:sid", async (req, res) => {
  const id = Number(req.params.sid);
  if (!Number.isInteger(id) || id < 0) {
    return res.status(400).json({
      status: RESPONSES_STATUS.BAD_REQUEST,
      message: "El ID es invalido",
    });
  }

  try {
    await manager.deleteService(id);
    res.status(200).json({
      status: RESPONSES_STATUS.SUCCESS,
      message: `El servicio con id ${id} se elimino correctamente`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: RESPONSES_STATUS.ERROR,
      message: "Error al eliminar el servicio.",
    });
  }
});

export default router;
