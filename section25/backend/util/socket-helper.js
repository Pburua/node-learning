const { Server: SocketServer } = require("socket.io");

let socketio;

const socketHelper = {
  init: (httpServer) => {
    socketio = new SocketServer(httpServer, {
      cors: {
        origin: "http://localhost:3000",
      },
    });
    return socketio;
  },
  getIO: () => {
    if (!socketio) {
      throw new Error("Socket IO not initialized.");
    }
    return socketio;
  },
};

module.exports = socketHelper;
