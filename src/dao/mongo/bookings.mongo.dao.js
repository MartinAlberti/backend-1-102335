import { BookingModel } from "../models/booking.model.js";

export default class BookingsMongoDao {
  getById(id) {
    return BookingModel.findById(id);
  }
  create(data) {
    return BookingModel.create(data);
  }
  update(id, data) {
    return BookingModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }
}
