import mongoose from "mongoose";
import app from "./app.js";
import envConfig from "./src/config/env.config.js";
import { connectDB } from "./src/config/database.config.js";

const startServer = async () => {
  try {
    //Primero conectamos la base de datos.
    await connectDB();

    //Si la conexion funciona, levantamos el servidor
    const server = app.listen(envConfig.port, () => {
      console.log(
        `La API esta utilizando la URL: http://localhost:${envConfig.port}`,
      );
    });
    server.on("error", async () => {
      console.error("No se pudo abrir el puerto HTTP. Revisar PORT o si esta ocupado.");
      await mongoose.disconnect();
      process.exitCode = 1;
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor. Revisar la configuracion y el acceso a MongoDB.");
    process.exitCode = 1;
  }
};
startServer();
