import { readFile, writeFile } from "node:fs/promises";

export default class ServicesFsDao {
  constructor(databasePath) {
    this.databasePath = databasePath;
  }

  async #save(services) {
    await writeFile(this.databasePath, JSON.stringify(services, null, 2));
  }

  async getAll() {
    try {
      const data = await readFile(this.databasePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") return [];
      throw error;
    }
  }

  async getById(id) {
    const services = await this.getAll();
    return services.find((service) => service.id === id) ?? null;
  }

  async create(data) {
    const services = await this.getAll();
    const id =
      data.length > 0 ? Math.max(...data.map((service) => service.id)) + 1 : 1;

    const service = { ...data, id };
    services.push(service);

    await this.#save(services);
    return service;
  }

  update(id, data) {}

  async delete(id) {
    const services = await this.getAll();
    // [services]
    const filteredService = services.filter((service) => service.id !== id);
    // early return
    if (services.length === filteredService.length) return false;
    await this.#save(filteredService);
    return true;
  }
}
