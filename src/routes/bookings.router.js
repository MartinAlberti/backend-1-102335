import { Router } from "express";
import { RESPONSES_STATUS } from "../constants/resStatus.js";

import path from "node:path";
import ServiceManager from "../managers/servicesManager.js";
import BookingManager from "../managers/bookingsManager.js";

const BOOKINGS_DATABASE_NAME = "bookings.json";
const SERVICES_DATABASE_NAME = "services.json";

const bookingsDatabasePath = path.join(
  import.meta.dirname,
  "..",
  "data",
  BOOKINGS_DATABASE_NAME,
);
const servicesDatabasePath = path.join(
  import.meta.dirname,
  "..",
  "data",
  SERVICES_DATABASE_NAME,
);

const serviceManager = new ServiceManager(servicesDatabasePath);
const manager = new BookingManager(bookingsDatabasePath, serviceManager);

const router = new Router();

router.get("/", async (req, res) => {
  try {
    const bookings = await manager.getBookings();
    return res.status(200).json({
      status: RESPONSES_STATUS.SUCCESS,
      payload: bookings,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: RESPONSES_STATUS.ERROR,
      message: "Error al obtener las reservas",
    });
  }
});

router.get("/:bid", async (req, res) => {
  const id = Number(req.params.bid);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      status: RESPONSES_STATUS.BAD_REQUEST,
      message: "El ID ES INVALIDO",
    });
  }
  try {
    const booking = await manager.getBookingById(id);
    if (!booking) {
      return res.status(404).json({
        status: RESPONSES_STATUS.NOT_FOUND,
        message: "Reserva no encontrada",
      });
    }
    return res.status(200).json({
      status: RESPONSES_STATUS.SUCCESS,
      payload: booking,
    });
  } catch (error) {
    return res.status(500).json({
      status: RESPONSES_STATUS.ERROR,
      message: "Error al obtener la reserva",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const newBooking = await manager.createBooking(req.body);
    return res.status(201).json({
      status: RESPONSES_STATUS.SUCCESS,
      payload: newBooking,
    });
  } catch (error) {
    if (error.code === "VALIDATION_ERROR") {
      return res.status(400).json({
        status: RESPONSES_STATUS.BAD_REQUEST,
        message: error.message,
      });
    }
    console.log(error);
    return res.status(500).json({
      status: RESPONSES_STATUS.ERROR,
      message: "Error al crear la reserva",
    });
  }
});

router.post("/:bid/services/:sid", async (req, res) => {
  const bookingId = Number(req.params.bid);
  const serviceId = Number(req.params.sid);

  if (
    !Number.isInteger(bookingId) ||
    bookingId <= 0 ||
    !Number.isInteger(serviceId) ||
    serviceId <= 0
  ) {
    return res.status(400).json({
      status: RESPONSES_STATUS.BAD_REQUEST,
      message: "Los ids deben ser enteros positivos",
    });
  }
  try {
    const updatedBooking = await manager.addServiceToBooking(
      bookingId,
      serviceId,
    );
    return res.status(200).json({
      status: RESPONSES_STATUS.SUCCESS,
      message: "Servicio agregado a la reserva correctamente",
      payload: updatedBooking,
    });
  } catch (error) {
    if (
      error.code === "BOOKING_NOT_FOUND" ||
      error.code === "SERVICE_NOT_FOUND"
    ) {
      return res.status(404).json({
        status: RESPONSES_STATUS.NOT_FOUND,
        message: error.message,
      });
    }
    console.log(error);
    return res.status(500).json({
      status: RESPONSES_STATUS.ERROR,
      message: "Error al crear la reserva",
    });
  }
});

export default router;
