import app from "./app.js";
import envConfig from "./src/config/env.config.js";

const server = app.listen(envConfig.port, () => {
  console.log(
    `La API esta utilizando la URL: http://localhost:${envConfig.port}`,
  );
});

server.on("error", (error) => {
  console.error(`No se pudo iniciar el servidor correctamente: ${error}`);
  process.exitCode = 1;
});
