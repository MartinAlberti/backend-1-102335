import express from "express";
import path from "node:path";
import ServiceManager from "./src/Managers/servirceManager.js";

const app = express();

const DATABASE_NAME = "services.json";
const databasePath = path.join(
  import.meta.dirname,
  "src",
  "data",
  DATABASE_NAME,
);
const manager = new ServiceManager(databasePath);

// Logger
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

// GET Services
app.get("/api/services", async (req, res) => {
  const services = await manager.getServices();
  res.status(200).json({
    status: "success",
    payload: services,
  });
});

// GET Service by ID
app.get("/api/services/:id", async (req, res) => {
  const id = req.params.id;
  const service = await manager.getServiceById(Number(id));
  res.status(200).json({
    status: "success",
    payload: service,
  });
});

// POST new Service
app.post("/api/services", async (req, res) => {
  const data = req.body;
  const result = await manager.addService(data);
  res.status(201).json({
    status: "success",
    payload: result.payload,
  });
});

app.delete("/api/services/:id", async (req, res) => {
  const id = req.params.id;
  const services = await manager.deleteService(Number(id));
  res.status(200).json({
    status: "success",
    message: `Servicio ${id} eliminado exitosamente`,
  });
});

// Middleware que devuelve una respuesta si el recurso/endpoint consultado no existe
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Ruta no encontrada",
  });
});

export default app;
