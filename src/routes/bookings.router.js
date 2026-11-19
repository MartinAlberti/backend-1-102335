import { Router } from "express";
// Controllers
import {
  getBookings,
  deleteBooking,
  removeServiceFromBooking,
  updateBookingStatus,
  createBooking,
  getBookingById,
  addServiceToBooking,
} from "../controllers/bookings.controller.js";

const router = Router();

//POST "/api/bookings"
router.post("", createBooking);
router.get("", getBookings);
router.delete("/:bid", deleteBooking);
router.delete("/:bid/services/:sid", removeServiceFromBooking);
//GET "/api/bookings/:bid"
router.get("/:bid", getBookingById);
//POST "/api/bookings/:bid/services/:sid"
router.post("/:bid/services/:sid", addServiceToBooking);

router.patch("/:bid/status", updateBookingStatus);

export default router;
