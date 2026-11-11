import app from "./app.js";
import envConfig from "./src/config/env.config.js";
import { connectDB } from "./src/config/database.config.js";

const startServer = async () => {
  try {
    //Primero conectamos la base de datos.
    await connectDB();

    //Si la conexion funciona, levantamos el servidor
    app.listen(envConfig.port, () => {
      console.log(
        `La API esta utilizando la URL: http://localhost:${envConfig.port}`,
      );
    });
  } catch (error) {
    console.error(`No se pudo iniciar el servidor correctamente: ${error}`);
    process.exitCode = 1;
  }
};
startServer();
