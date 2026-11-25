import mongoose from "mongoose";
import app from "./app.js";
import envConfig from "./src/config/env.config.js";
import { connectDB } from "./src/config/database.config.js";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { configureSockets } from "./src/config/socket.config.js";

const startServer = async () => {
  try {
    await connectDB();
    const httpServer = createServer(app);
    const io = new Server(httpServer);
    app.set("io", io);
    configureSockets(io);
    httpServer.listen(envConfig.port, () => {
      console.log(`Servidor en http://localhost:${envConfig.port}`);
    });
    httpServer.on("error", async () => {
      console.error(`No se pudo abrir el puerto ${envConfig.port}`);
      io.close();
      await mongoose.disconnect();
      process.exitCode = 1;
    });
  } catch (error) {
    console.error("No se pudo inicar el servidor, revisa mongodb y el entorno");
    process.exitCode = 1;
  }
};
startServer();
