import mongoose from "mongoose";
import { servicesService as manager } from "../config/dependencies.js";
import { RESPONSES_STATUS } from "../constants/resStatus.js";

function handleError(error, res) {
  if (
    error.code === "VALIDATION_ERROR" ||
    error.name === "ValidationError" ||
    error.name === "CastError"
  ) {
    return res
      .status(400)
      .json({ status: RESPONSES_STATUS.BAD_REQUEST, message: error.message });
  }
  console.error(error);
  return res
    .status(500)
    .json({
      status: RESPONSES_STATUS.ERROR,
      message: "Error al procesar el servicio.",
    });
}

const getServices = async (req, res) => {
  try {
    const services = await manager.getServices();
    res
      .status(200)
      .json({ status: RESPONSES_STATUS.SUCCESS, payload: services });
  } catch (error) {
    handleError(error, res);
  }
};

const getServiceById = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isObjectIdOrHexString(id)) {
    return res
      .status(400)
      .json({ status: RESPONSES_STATUS.BAD_REQUEST, message: "ID invalido" });
  }
  try {
    const service = await manager.getServiceById(id);
    if (!service) {
      return res
        .status(404)
        .json({
          status: RESPONSES_STATUS.NOT_FOUND,
          message: "Servicio no encontrado",
        });
    }
    res
      .status(200)
      .json({ status: RESPONSES_STATUS.SUCCESS, payload: service });
  } catch (error) {
    handleError(error, res);
  }
};

const createService = async (req, res) => {
  try {
    const service = await manager.addService(req.body);
    res
      .status(201)
      .json({ status: RESPONSES_STATUS.SUCCESS, payload: service.payload });
  } catch (error) {
    handleError(error, res);
  }
};

const updateService = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isObjectIdOrHexString(id)) {
    return res
      .status(400)
      .json({ status: RESPONSES_STATUS.BAD_REQUEST, message: "ID invalido" });
  }
  try {
    const result = await manager.updateService(id, req.body);
    res
      .status(result.status === RESPONSES_STATUS.NOT_FOUND ? 404 : 200)
      .json(result);
  } catch (error) {
    handleError(error, res);
  }
};

const deleteService = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isObjectIdOrHexString(id)) {
    return res
      .status(400)
      .json({ status: RESPONSES_STATUS.BAD_REQUEST, message: "ID invalido" });
  }
  try {
    const result = await manager.delete(id);
    res
      .status(result.status === RESPONSES_STATUS.NOT_FOUND ? 404 : 200)
      .json(result);
  } catch (error) {
    handleError(error, res);
  }
};

export {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
