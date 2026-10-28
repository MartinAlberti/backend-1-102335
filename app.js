import express from "express";
import serviceRouter from "./src/routes/services.router.js"
import bookingsRouter from "./src/routes/bookings.router.js"
import { SERVICES_PATH } from "./src/config/paths.config.js";
import { BOOKINGS_PATH } from "./src/config/paths.config.js";

const app = express();


// Logger - userId - permiso del user
app.use((req, res, next) => {
  console.info(`${req.method} ${req.url}`);
  next();
});

// Middleware para parseo de json
app.use(express.json());

// API health
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is up!",
  });
});

//Routers
app.use(SERVICES_PATH, serviceRouter)
app.use(BOOKINGS_PATH, bookingsRouter)

// Middleware que devuelve una respuesta si el recurso/endpoint consultado no existe
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Ruta no encontrada",
  });
});

export default app;
