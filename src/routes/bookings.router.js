import { Router } from "express";
// Controllers
import {
  createBooking,
  getBookingById,
  addServiceToBooking,
} from "../controllers/bookings.controller.js";

const router = Router();

//POST "/api/bookings"
router.post("", createBooking);
//GET "/api/bookings/:bid"
router.get("/:bid", getBookingById);
//POST "/api/bookings/:bid/services/:sid"
router.post("/:bid/services/:sid", addServiceToBooking);

export default router;
