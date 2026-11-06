function invalid(message) {
  const error = new Error(message);
  error.code = "VALIDATION_ERROR";
  return error;
}

export default class BookingsService {
  constructor(bookingsRepository, servicesRepository) {
    this.bookingsRepository = bookingsRepository;
    this.servicesRepository = servicesRepository;
  }

  createBooking(user) {
    return this.bookingsRepository.create({ user, services: [] });
  }

  getBookingById(id) {
    return this.bookingsRepository.getById(id);
  }

  async addServiceToBooking(bid, sid, date) {
    const service = await this.servicesRepository.getById(sid);
    if (!service) {
      throw invalid("El servicio no existe");
    }
    const booking = await this.bookingsRepository.getById(bid);

    const formatDate = new Date(date).toISOString();
    const item = booking.services.find(
      (item) => item.service === sid && item.date === formatDate,
    );
    if (item) {
      item.quantity += 1;
    } else {
      booking.services.push({ service: sid, quantity: 1, date: formatDate });
    }

    return this.bookingsRepository.update(id, booking);
  }
}
