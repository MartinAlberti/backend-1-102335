import mongoose from "mongoose";
import { bookingsService, servicesService } from "../config/dependencies.js";

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

function validateId(id) {
  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400); // completar
  }
}

const renderServices = async (req, res) => {
  try {
    const servicePlain = await servicesService.getServices();
    const services = plain(servicePlain);
    res.render("services", { title: "Servicios", services });
  } catch (error) {}
};

const renderServiceDetail = async (req, res) => {
  const { sid } = req.params;
  validateId(sid);
  try {
    const service = await servicesService.getServiceById(sid);
    if (!service) return res.status(404); //completar
    res.render("service-detail", {
      title: "Detalle del servicio",
      service: plain(service),
    });
  } catch (error) {}
};

const renderBooking = async (req, res) => {
  try {
    const bookingsPlain = await bookingsService.getBookings();
    const bookings = plain(bookingsPlain)
    res.render("bookings", { title: "Reservas", bookings });
  } catch (error) {
    console.log(error)
  }
};

const renderBookingDetail = async (req, res) => {
  const { bid } = req.params;
  validateId(bid);
  try {
    const booking = await bookingsService.getBookingById(bid);
    if (!booking) return res.status(404);
    res.render("booking-detail", {
      title: "Detalle de reserva",
      booking: plain(booking),
    });
  } catch (error) {}
};

const renderSocketTest = (req, res) => {
  res.render("socket-test", {title: "Prueba de Socket"})
}

export {
  renderServices,
  renderServiceDetail,
  renderBooking,
  renderBookingDetail,
  renderSocketTest
};
