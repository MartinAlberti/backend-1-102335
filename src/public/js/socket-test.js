const socket = io();
const status = document.getElementById("socket-status");
const form = document.getElementById("message-form");
const input = document.getElementById("message-input");
const list = document.getElementById("message-list");
const errorMessage = document.getElementById("test-error");

socket.on("welcome", (data) => {
  status.textContent = `${data.message}. Tu conexion tiene el id: ${data.id}`;
});

socket.on("disconnect", () => {
  status.textContent = "Desconectado.";
});

socket.on("connect_error", () => {
  status.textContent = "No se pudo establecer la conexión con el servidor";
});

socket.on("serverMessage", (data) => {
  const item = document.createElement("li");
  item.textContent = `${data.sender}: ${data.text}`;
  list.append(item);
});

socket.on("testError", (message) => {
  errorMessage.textContent = message;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!socket.connected) {
    errorMessage.textContent = "Esperar a que vuelva la conexión";
    return;
  }
  errorMessage.textContent = "";
  socket.emit("clientMessage", input.value);
  input.value = "";
});
