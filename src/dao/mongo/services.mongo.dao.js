import { ServicesModel } from "../models/service.model.js";

export default class ServicesMongoDao {
  getAll() {
    return ServicesModel.find();
  }

  getById(id) {
    return ServicesModel.findById(id);
  }

  create(data) {
    return ServicesModel.create(data);
  }
  update(id, data) {
    return ServicesModel.findByIdAndUpdate(id, data, {
      returnDocument: "after",
      runValidators: true,
    });
  }
  delete(id) {
    return ServicesModel.findByIdAndDelete(id);
  }
}
