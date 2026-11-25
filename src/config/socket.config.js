export function configureSockets(io) {
  io.on("connection", (socket) => {
    console.log("Cliente conectado", socket.id);
    socket.emit("welcome", { message: "Conexión establecida", id: socket.id });

    socket.on("clientMessage", (text) => {
      io.emit("serverMessage", { text: text.trim(), sender: socket.id });
    });

    socket.on("disconnect", () =>
      console.log("Cliente desconectado.", socket.id),
    );
  });
}
