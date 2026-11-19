const { PORT, NODE_ENV, MONGODB_URI } = process.env;

if (!PORT || !NODE_ENV || !MONGODB_URI)
  throw new Error("Configurar PORT, NODE_ENV y MONGODB_URI en el archivo .env");

const port = Number(PORT);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("Puerto invalido, debe ser un numero");
}
export default {
  port,
  nodeEnv: NODE_ENV,
  mongoUri: MONGODB_URI,
};
