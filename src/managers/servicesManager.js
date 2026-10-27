// import { error } from "node:console";
import { readFile, writeFile } from "node:fs/promises";
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

export default class ServiceManager {
  constructor(databasePath) {
    this.databasePath = databasePath;
  }

  // Metodos que se encarguen de hacer el CRUD

  async #save(services) {
    await writeFile(this.databasePath, JSON.stringify(services, null, 2));
  }

  async getServices() {
    try {
      const data = await readFile(this.databasePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") return [];
      throw error;
    }
  }
  async getServiceById(idService) {
    try {
      const data = await this.getServices();
      return data.find((service) => service.id === idService) ?? null; // === (Valor y Type) == (valor)
    } catch (error) {
      if (error.code === "ENOENT") return {};
      throw error;
    }
  }

  validate(data) {
    if (!data || typeof data !== "object") {
      throw invalid("La data tiene que ser un objeto JSON");
    }
    for (const field of REQUIRED_FIELDS) {
      if (data[field] === undefined || data[field] === null) {
        throw invalid(`Falta el dato: ${field}`);
      }
    }
  }

  async addService(serviceData) {
    this.validate(serviceData);
    const data = await this.getServices();
    const id =
      data.length > 0 ? Math.max(...data.map((service) => service.id)) + 1 : 1;
    const { name, description, duration, price, category, available } =
      serviceData;
    const newService = {
      id,
      name,
      description,
      duration,
      price,
      category,
      available,
    };
    data.push(newService);
    await this.#save(data);

    return { payload: newService, status: "ok" };
  }

  async updateService(idService, updatedServiceData) {
    const services = await this.getServices();

    // Buscamos la posición del servicio por su ID
    const index = services.findIndex((service) => service.id === idService);

    // Si no existe, devolvemos null
    if (index === -1) {
      return null;
    }

    // Evitamos que el cliente modifique el ID
    const { id, ...fieldsToUpdate } = updatedServiceData;

    // Actualizamos el servicio conservando los campos no modificados
    services[index] = {
      ...services[index],
      ...fieldsToUpdate,
    };

    await this.#save(services);

    return services[index];
  }

  async deleteService(idService) {
    const services = await this.getServices();
    const filteredServices = services.filter(
      (service) => service.id !== idService,
    );
    if (services.length === filteredServices.length)
      return {
        payload: idService,
        status: "notOk",
        message: "notFoundService",
      };
    this.#save(filteredServices);
    return {
      payload: idService,
      status: "Ok",
    };
  }
}
