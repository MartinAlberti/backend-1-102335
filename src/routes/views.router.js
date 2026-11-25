import { Router } from "express";
import {
  renderBooking,
  renderBookingDetail,
  renderServiceDetail,
  renderServices,
  renderSocketTest,
} from "../controllers/views.controller.js";

const router = Router();
router.get("/services", renderServices);
router.get("/services/:sid", renderServiceDetail);
router.get("/bookings", renderBooking);
router.get("/bookings/:bid", renderBookingDetail);
router.get("/socket-test", renderSocketTest)

export default router;
