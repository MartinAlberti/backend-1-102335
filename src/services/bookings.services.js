const REQUIRED_FIELDS = ["clientName", "clientEmail", "date", "time"];

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

  createBooking(data) {
    if (!data || typeof data !== "object") {
      throw invalid("Debe enviar un objeto JSON");
    }
    for (const field of REQUIRED_FIELDS) {
      if (data[field] !== "string" || !data[field].trim()) {
        throw invalid(`Falta el campo: ${field}`);
      }
    }
    const { clientName, clientEmail, date, time, status = "pending" } = data;
    return this.bookingsRepository.create({
      clientName,
      clientEmail,
      date,
      time,
      status,
      services: [],
    });
  }

  getBookingById(id) {
    return this.bookingsRepository.getById(id);
  }

  async addServiceToBooking(bid, sid) {
    const service = await this.servicesRepository.getById(sid);
    if (!service) return null;
    const booking = await this.bookingsRepository.getById(bid);
    if (!booking) return null;

    const item = booking.services.find(
      (item) => item.service.toString() === sid,
    );
    if (item) {
      item.quantity += 1;
    } else {
      booking.services.push({ service: sid, quantity: 1 });
    }

    return this.bookingsRepository.update(bid, booking);
  }
}
