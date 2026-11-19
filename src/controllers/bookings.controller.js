import mongoose from "mongoose";

import { bookingsService as manager } from "../config/dependencies.js";

import { RESPONSES_STATUS } from "../constants/resStatus.js";

const createBooking = async (req, res) => {
  try {
    const booking = await manager.createBooking(req.body);
    res.status(201).json({
      status: RESPONSES_STATUS.SUCCESS,
      payload: booking,
    });
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      return res.status(404).json({ status: RESPONSES_STATUS.NOT_FOUND, message: error.message });
    }
    if (error.code === "VALIDATION_ERROR" || error.name === "ValidationError" || error.name === "CastError") {
      return res
        .status(400)
        .json({ status: RESPONSES_STATUS.BAD_REQUEST, message: error.message });
    }
    console.error(error);
    res.status(500).json({
      status: RESPONSES_STATUS.ERROR,
      message: "Error al crear la reserva.",
    });
  }
};

const getBookingById = async (req, res) => {
  const id = req.params.bid;
  if (!mongoose.isObjectIdOrHexString(id)) {
    return res
      .status(400)
      .json({ status: RESPONSES_STATUS.BAD_REQUEST, message: "ID invalido" });
  }
  try {
    const booking = await manager.getBookingById(id);
    if (!booking) {
      return res.status(404).json({
        status: RESPONSES_STATUS.NOT_FOUND,
        message: "Reserva no encontrada",
      });
    }
    res.status(200).json({
      status: RESPONSES_STATUS.SUCCESS,
      payload: booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: RESPONSES_STATUS.ERROR,
      message: "Error al obtener la reserva.",
    });
  }
};

const addServiceToBooking = async (req, res) => {
  const { bid, sid } = req.params;
  if (!mongoose.isObjectIdOrHexString(bid) || !mongoose.isObjectIdOrHexString(sid)) {
    return res
      .status(400)
      .json({ status: RESPONSES_STATUS.BAD_REQUEST, message: "ID invalido" });
  }
  try {
    const booking = await manager.addServiceToBooking(bid, sid);
    if (!booking) {
      return res.status(404).json({
        status: RESPONSES_STATUS.NOT_FOUND,
        message: "Reserva no encontrada",
      });
    }
    res.status(200).json({
      status: RESPONSES_STATUS.SUCCESS,
      payload: booking,
    });
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      return res.status(404).json({ status: RESPONSES_STATUS.NOT_FOUND, message: error.message });
    }
    if (error.code === "VALIDATION_ERROR" || error.name === "ValidationError" || error.name === "CastError") {
      return res
        .status(400)
        .json({ status: RESPONSES_STATUS.BAD_REQUEST, message: error.message });
    }
    console.error(error);
    res.status(500).json({
      status: RESPONSES_STATUS.ERROR,
      message: "Error al agregar el servicio a la reserva.",
    });
  }
};

const updateBookingStatus = async (req, res) => {
  const id = req.params.bid;
  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({ status: RESPONSES_STATUS.BAD_REQUEST, message: "ID invalido" });
  }
  try {
    const booking = await manager.updateBookingStatus(id, req.body?.status);
    if (!booking) {
      return res.status(404).json({ status: RESPONSES_STATUS.NOT_FOUND, message: "Reserva no encontrada" });
    }
    res.status(200).json({ status: RESPONSES_STATUS.SUCCESS, payload: booking });
  } catch (error) {
    if (error.code === "VALIDATION_ERROR" || error.name === "ValidationError") {
      return res.status(400).json({ status: RESPONSES_STATUS.BAD_REQUEST, message: error.message });
    }
    console.error("Error al actualizar el estado de la reserva");
    res.status(500).json({ status: RESPONSES_STATUS.ERROR, message: "Error al actualizar la reserva." });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await manager.getBookings();
    res.status(200).json({ status: RESPONSES_STATUS.SUCCESS, payload: bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: RESPONSES_STATUS.ERROR, message: "Error al obtener las reservas." });
  }
};

const deleteBooking = async (req, res) => {
  const { bid } = req.params;
  if (!mongoose.isObjectIdOrHexString(bid)) {
    return res.status(400).json({ status: RESPONSES_STATUS.BAD_REQUEST, message: "ID invalido" });
  }
  try {
    const booking = await manager.deleteBooking(bid);
    if (!booking) {
      return res.status(404).json({ status: RESPONSES_STATUS.NOT_FOUND, message: "Reserva no encontrada" });
    }
    res.status(200).json({ status: RESPONSES_STATUS.DELETED, payload: booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: RESPONSES_STATUS.ERROR, message: "Error al eliminar la reserva." });
  }
};

const removeServiceFromBooking = async (req, res) => {
  const { bid, sid } = req.params;
  if (!mongoose.isObjectIdOrHexString(bid) || !mongoose.isObjectIdOrHexString(sid)) {
    return res.status(400).json({ status: RESPONSES_STATUS.BAD_REQUEST, message: "IDs invalidos" });
  }
  try {
    const booking = await manager.removeServiceFromBooking(bid, sid);
    if (!booking) {
      return res.status(404).json({ status: RESPONSES_STATUS.NOT_FOUND, message: "Reserva no encontrada" });
    }
    res.status(200).json({ status: RESPONSES_STATUS.SUCCESS, payload: booking });
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      return res.status(404).json({ status: RESPONSES_STATUS.NOT_FOUND, message: error.message });
    }
    console.error(error);
    res.status(500).json({ status: RESPONSES_STATUS.ERROR, message: "Error al quitar el servicio." });
  }
};

export { createBooking, getBookingById, addServiceToBooking, updateBookingStatus, getBookings, deleteBooking, removeServiceFromBooking };
