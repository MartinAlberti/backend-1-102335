import ServicesMongoDao from "../dao/mongo/services.mongo.dao.js";
import BookingsMongoDao from "../dao/mongo/bookings.mongo.dao.js";
import ServicesRepository from "../repositories/services.repository.js";
import BookingsRepository from "../repositories/bookings.repository.js";
import ServicesService from "../services/services.service.js";
import BookingsService from "../services/bookings.services.js";

//MongoDb

const servicesDao = new ServicesMongoDao();
const bookingsDao = new BookingsMongoDao();

const servicesRepository = new ServicesRepository(servicesDao);
const bookingsRepository = new BookingsRepository(bookingsDao);

const servicesService = new ServicesService(servicesRepository);
const bookingsService = new BookingsService(
  bookingsRepository,
  servicesRepository,
);

export { servicesService, bookingsService };
