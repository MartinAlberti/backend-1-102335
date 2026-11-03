import { readFile, writeFile } from "node:fs/promises";

export default class BookingManager {
  constructor(databasePath) {
    this.databasePath = databasePath;
  }

  async #save(bookings) {
    await writeFile(this.databasePath, JSON.stringify(bookings, null, 2));
  }

  async getBookings() {
    try {
      const data = await readFile(this.databasePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") return [];
      throw error;
    }
  }

  async createBooking(user) {
    const bookings = await this.getBookings();
    const id = bookings.length > 0
      ? Math.max(...bookings.map((booking) => booking.id)) + 1
      : 1;
    const newBooking = { id, user, services: [] };
    bookings.push(newBooking);
    await this.#save(bookings);
    return newBooking;
  }

  async getBookingById(idBooking) {
    const bookings = await this.getBookings();
    return bookings.find((booking) => booking.id === idBooking) ?? null;
  }

  async addServiceToBooking(idBooking, idService, date) {
    const bookings = await this.getBookings();
    const booking = bookings.find((booking) => booking.id === idBooking);
    if (!booking) return null;

    const service = booking.services.find(
      (service) => service.service === idService && service.date === date,
    );
    if (service) {
      service.quantity += 1;
    } else {
      booking.services.push({ service: idService, quantity: 1, date });
    }
    await this.#save(bookings);
    return booking;
  }
}
