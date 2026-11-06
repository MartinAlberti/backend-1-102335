import path from "node:path";
import ServicesFsDao from "../dao/fileSystem/services.fs.dao.js";
import ServicesRepository from "../repositories/services.respository.js";
import ServicesService from "../services/services.service.js";

const DATABASE_SERVICES_NAME = "services.json";
const DATABASE_BOOKINGS_NAME = "bookings.json";
const servicesPath = path.join(
  import.meta.dirname,
  "..",
  "data",
  DATABASE_SERVICES_NAME,
);

// const servicesDao = new ServicesFsDao(servicesPath);
const servicesDao = new ServicesFsDao(servicesPath);
const servicesRepository = new ServicesRepository(servicesDao);
const servicesService = new ServicesService(servicesRepository);

import BookingsFsDao from "../dao/fileSystem/bookings.fs.dao.js";
import BookingsService from "../services/bookings.services.js";
import BookingsRepository from "../repositories/bookings.repository.js";

const bookingsPath = path.join(
  import.meta.dirname,
  "..",
  "data",
  DATABASE_BOOKINGS_NAME,
);

const bookingsDao = new BookingsFsDao(bookingsPath);
const bookingsRepository = new BookingsRepository(bookingsDao);
const bookingsService = new BookingsService(bookingsRepository);

export {
  bookingsRepository,
  bookingsService,
  servicesRepository,
  servicesService,
};
