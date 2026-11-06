import { readFile, writeFile } from "node:fs/promises";

export default class BookingsFsDao {
  constructor(databasePath) {
    this.databasePath = databasePath;
  }

  async #save(bookings) {
    await writeFile(this.databasePath, JSON.stringify(bookings, null, 2));
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
    const bookings = await this.getAll();
    return bookings.find((booking) => booking.id === id);
  }

  async create(data) {
    const bookings = await this.getAll();
    const id =
      bookings.length > 0
        ? Math.max(...bookings.map((booking) => booking.id)) + 1
        : 1;
    const booking = { ...data, id };
    bookings.push(booking);
    await this.#save(bookings);
    return booking;
  }

  async update(id, data) {
    const bookings = await this.getAll();
    const index = bookings.findIndex((booking) => booking.id === id);
    if (index === -1) return null;
    bookings[index] = { ...data, id };
    await this.#save(bookings);
    return bookings[index];
  }
}
