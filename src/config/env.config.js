const { PORT, NODE_ENV } = process.env;

if (!PORT || !NODE_ENV)
  throw new Error("Algunas variables faltan -> revisar el .env file");

const port = Number(PORT);

if(!Number.isInteger(port) || port > 8000) {
    throw new Error("Puerto invalido, debe ser un numero")
}
export default {
  port,
  nodeEnv: NODE_ENV,
};
