import { BookingModel } from "../models/booking.model.js";

export default class BookingsMongoDao {
  getAll() {
    return BookingModel.find();
  }

  delete(id) {
    return BookingModel.findByIdAndDelete(id);
  }

  getById(id) {
    return BookingModel.findById(id);
  }
  create(data) {
    return BookingModel.create(data);
  }
  update(id, data) {
    return BookingModel.findByIdAndUpdate(id, data, {
      returnDocument: "after",
      runValidators: true,
    });
  }
}
