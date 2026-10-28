import { readFile, writeFile } from "node:fs/promises";
import { devNull } from "node:os";
const REQUIRED_FIELDS = ["clientName", "clientEmail", "date", "time"];

function invalid(message) {
  const error = new Error(message);
  error.code = "VALIDATION_ERROR";
  return error;
}

function notFound(message, code) {
  const error = new Error(message);
  error.code = code;
  return error;
}

export default class BookingManager {
  constructor(databasePath, servicesManager) {
    this.databasePath = databasePath;
    this.servicesManager = servicesManager;
  }
  async #save(bookings) {
    await writeFile(
      this.databasePath,
      JSON.stringify(bookings, null, 2),
      "utf-8",
    );
  }

  async getBookings() {
    try {
      const data = await readFile(this.databasePath, "utf-8");
      const bookings = JSON.parse(data);
      return bookings;
    } catch (error) {
      if (error.code === "ENOENT") {
        return [];
      }
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

  async createBooking(bookingData) {
    this.validate(bookingData);

    const bookings = await this.getBookings();
    const id =
      bookings.length > 0
        ? Math.max(...bookings.map((booking) => booking.id)) + 1
        : 1;

    const newBooking = {
      id,
      clientName: bookingData.clientName,
      clientEmail: bookingData.clientEmail,
      date: bookingData.date,
      time: bookingData.time,
      status: "pending",
      services: [],
    };

    bookings.push(newBooking);

    await this.#save(bookings);
    return newBooking;
  }

  async getBookingById(idBooking) {
    const id = Number(idBooking);
    if (!Number.isInteger(id) || id <= 0) {
      return null;
    }
    const bookings = await this.getBookings();
    return bookings.find((booking) => booking.id === id) ?? null;
  }

  async addServiceToBooking(idBooking, idService) {
    const bookingId = Number(idBooking);
    const serviceId = Number(idService);

    if (
      !Number.isInteger(bookingId) ||
      bookingId <= 0 ||
      !Number.isInteger(serviceId) ||
      serviceId <= 0
    ) {
      throw invalid("los ID deben ser enteros positivos");
    }

    const bookings = await this.getBookings();
    const booking = bookings.find((item) => item.id === bookingId);
    if (!booking) {
      throw notFound("Reserva no encontrada", "BOOKING_NOT_FOUND");
    }
    const bookingService = booking.service.find(
      (item) => item.service === serviceId,
    );

    if (bookingService) {
      bookingService.quantity += 1;
    } else {
      booking.services.push({
        service: serviceId,
        quantity: 1,
      });
    }
    await this.#save(bookings);
    return booking;
  }
}
