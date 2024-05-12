import io from "socket.io-client";

export const socket = io(
  "http://localhost:3004",
  {
    transports: ["websocket", "polling"],
    reconnection: true,
    secure: true,
  }
);