export default class ServicesRepository {
  constructor(dao) {
    this.dao = dao;
  }

  // Definimos nombres de servicio
  getAll() {
    return this.dao.getAll();
  }

  //Obtener un solo servicio
  getById(id) {
    return this.dao.getById(id);
  }

  //Crear un servicio
  create(data) {
    return this.dao.create(data);
  }

  // Modificar un servicio
  update(id, data) {
    return this.dao.update(id, data);
  }

  //Eliminar un servicio
  delete(id) {
    return this.dao.delete(id);
  }
}
