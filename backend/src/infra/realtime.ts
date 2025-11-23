import { Server as SocketIOServer } from "socket.io";
import http from "http";

export function setupRealtime(server: http.Server) {
  const io = new SocketIOServer(server, { 
    cors: { 
      origin: process.env.APP_URL,
      methods: ["GET", "POST"]
    }
  });
  io.on("connection", () => {});
  return io;
}
