// a la clase ServicesServices le asignas una propiedad // Prototyping

import { RESPONSES_STATUS } from "../constants/resStatus.js";

// Javascript no es un lenguaje orientado a objetos
const REQUIRED_FIELDS = [
  "name",
  "description",
  "price",
  "duration",
  "category",
  "available",
];

function invalid(message) {
  const error = new Error(message);
  error.code = "VALIDATION_ERROR";
  return error;
}

export default class ServicesService {
  constructor(repository) {
    this.repository = repository;
  }

  #validate(data, partial = false) {
    if (!data || typeof data !== "object") {
      throw invalid("La data tiene que ser un objeto JSON");
    }

    if (!partial) {
      for (const field of REQUIRED_FIELDS) {
        if (data[field] === undefined || data[field] === null) {
          throw invalid(`Falta el dato: ${field}`);
        }
      }
    }
    if (data.available !== undefined && typeof data.available !== "boolean") {
      throw invalid("Available debe ser true o false");
    }
  }

  getServices() {
    return this.repository.getAll();
  }

  getServiceById(id) {
    return this.repository.getById(id);
  }

  async addService(data) {
    this.#validate(data);
    const { name, description, duration, price, category, available } = data;
    const service = await this.repository.create({
      name,
      description,
      duration,
      price,
      category,
      available,
    });
    return { payload: service, status: RESPONSES_STATUS.CREATED };
  }

  async updateService(id, data) {
    this.#validate(data, true);
    const updatedData = {};
    for (const field of REQUIRED_FIELDS) {
      if (data[field] !== undefined) updatedData[field] = data[field];
    }

    const service = await this.repository.update(id, updatedData);
    if (!service) {
      return {
        status: RESPONSES_STATUS.NOT_FOUND,
        message: "Servicio no encontrado",
      };
    }
    return { status: RESPONSES_STATUS.SUCCESS, payload: service };
  }

  async delete(id) {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      return {
        payload: id,
        status: RESPONSES_STATUS.NOT_FOUND,
        message: "No se encontró el servicio",
      };
    }
    return { payload: id, status: RESPONSES_STATUS.DELETED };
  }
}
