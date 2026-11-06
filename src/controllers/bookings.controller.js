import { bookingsService as manager, servicesService as serviceManager } from "../config/dependencies.js";

import { RESPONSES_STATUS } from "../constants/resStatus.js";

const createBooking = async (req, res) => {
  const user = req.body?.user;
  if (!Number.isInteger(user) || user <= 0) {
    return res.status(400).json({
      status: RESPONSES_STATUS.BAD_REQUEST,
      message: "El user debe ser un ID numerico positivo",
    });
  }
  try {
    const booking = await manager.createBooking(user);
    res.status(201).json({
      status: RESPONSES_STATUS.SUCCESS,
      payload: booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: RESPONSES_STATUS.ERROR,
      message: "Error al crear la reserva.",
    });
  }
};

const getBookingById = async (req, res) => {
  const id = Number(req.params.bid);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      status: RESPONSES_STATUS.BAD_REQUEST,
      message: "El ID es invalido",
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
  const bid = Number(req.params.bid);
  const sid = Number(req.params.sid);
  if (
    !Number.isInteger(bid) ||
    bid <= 0 ||
    !Number.isInteger(sid) ||
    sid <= 0
  ) {
    return res.status(400).json({
      status: RESPONSES_STATUS.BAD_REQUEST,
      message: "Los IDs son invalidos",
    });
  }

  const date = req.body?.date;
  // Fecha y hora ISO con zona horaria, por ejemplo: 2026-11-10T15:00:00-03:00
  if (
    typeof date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/.test(
      date,
    ) ||
    !Number.isFinite(Date.parse(date))
  ) {
    return res.status(400).json({
      status: RESPONSES_STATUS.BAD_REQUEST,
      message: "La fecha debe incluir fecha, hora y zona horaria ISO",
    });
  }

  try {
    const service = await serviceManager.getServiceById(sid);
    if (!service) {
      return res.status(404).json({
        status: RESPONSES_STATUS.NOT_FOUND,
        message: "Servicio no encontrado",
      });
    }
    // Unificamos la fecha para comparar tambien horarios con distintas zonas.
    const booking = await manager.addServiceToBooking(
      bid,
      sid,
      new Date(date).toISOString(),
    );
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
      message: "Error al agregar el servicio a la reserva.",
    });
  }
};

export { createBooking, getBookingById, addServiceToBooking };
