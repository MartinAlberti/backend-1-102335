import { servicesService as manager } from "../config/dependencies.js";
import { RESPONSES_STATUS } from "../constants/resStatus.js";

//Async/Await al codigo bloqueante en Javascript
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

const getServiceById = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 0) {
    return res.status(400).json({
      status: RESPONSES_STATUS.BAD_REQUEST,
      message: "El ID es invalido",
    });
  }
  try {
    const service = await manager.getServiceById(id);
    if (!service) {
      return res.status(404).json({
        status: RESPONSES_STATUS.NOT_FOUND,
        message: "Servicio no encontrado",
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
};

const createService = async (req, res) => {
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
};

const deleteService = async (req, res) => {
  const id = Number(req.params.id);
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
};

export { getServices, getServiceById, createService, deleteService };
