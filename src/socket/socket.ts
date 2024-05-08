import io from "socket.io-client";

export const socket = io(
  "https://localhost:3001",
  {
    transports: ["websocket", "polling"],
    reconnection: true,
    secure: true,
  }
);