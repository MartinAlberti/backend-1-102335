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

    //Validamos los campos de texto.
    const textFields = ["name", "description", "category"];

    for (const field of textFields) {
      if (typeof data[field] !== "string" || !data[field].trim()) {
        throw invalid(`El campo ${field} debe ser un texto válido`);
      }
    }

    //La duracion debe ser un nimero entero positivo
    if (!Number.isInteger(data.duration) || data.duration <= 0) {
      throw invalid(`La duracion debe ser un entero positivo`);
    }

    //El precio debe ser un numero mayor a 0
    if (
      typeof data.price !== "number" ||
      !Number.isFinite(data.price) ||
      data.price <= 0
    ) {
      throw invalid(`El precio debe ser un numero entero positivo`);
    }

    //Asegurarse de que available sea booleano
    if (typeof data.available !== "boolean") {
      throw invalid(`Available debe ser true o false`);
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

    //Creamos un objeto unicamente con los campos permitidos.
    const fieldsToUpdate = {};

    for (const field of REQUIRED_FIELDS) {
      if (updatedServiceData[field] !== undefined) {
        //Me falto updatedServiceData[field]
        fieldsToUpdate[field] = updatedServiceData[field];
      }
    }

    //Combinamos el servicio original con los campos enviados.
    //Todavia no modificamos el erray
    const updatedService = {
      ...services[index],
      ...fieldsToUpdate,
    };
    this.validate(updatedService);
    services[index] = updatedService;
    await this.#save(services);

    return updatedService;
  }
  async deleteService(idService) {
    const services = await this.getServices();
    const index = services.findIndex((service) => service.id === idService);

    if (index === -1) {
      return {
        payload: idService,
        status: "notOk",
        message: "serviceNotFound",
      };
    }
    //Eliminamos el servicio

    const [deletedService] = services.splice(index, 1);

    await this.#save(services);
    return {
      payload: deletedService,
      status: "Ok",
    };
  }

  // async deleteService(idService) {
  //   const services = await this.getServices();
  //   const filteredServices = services.filter(
  //     (service) => service.id !== idService,
  //   );
  //   if (services.length === filteredServices.length)
  //     return {
  //       payload: idService,
  //       status: "notOk",
  //       message: "notFoundService",
  //     };
  //   this.#save(filteredServices);
  //   return {
  //     payload: idService,
  //     status: "Ok",
  //   };
  // }
}
