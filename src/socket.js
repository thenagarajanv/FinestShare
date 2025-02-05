// src/socket.js
import { io } from "socket.io-client";

const socket = io("https://finestshare-backend.onrender.com", { 
  autoConnect: false,
});

socket.on("connect", () => {
  console.log("Connected to WebSocket server:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from WebSocket server.");
});

socket.on("connect_error", (err) => {
  console.error("WebSocket connection error:", err.message);
});

export default socket;
