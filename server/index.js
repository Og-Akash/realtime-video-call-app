import express from "express";
import { Server } from "socket.io";
import http from "node:http";
import { ACTIONS } from "./actions.js";
import cors from "cors";

// Initialize the servers
const app = express();
const port = 8000;

// Creating an HTTP server
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: true,
});

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

const emailToSocketMapping = new Map();
const socketIdToEmailMapping = new Map();

io.on("connection", (socket) => {
  console.log("New client connected: ", socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, peerId, email }) => {
    console.log(`User joined: ${email} in room ${roomId} with peer ID ${peerId}`);
    emailToSocketMapping.set(email, socket.id);
    socketIdToEmailMapping.set(socket.id, email);
    socket.join(roomId);
    socket.emit(ACTIONS.JOINED, { roomId });
    socket.broadcast.to(roomId).emit(ACTIONS.USER_JOINED, { email, peerId });
  });

  socket.on(ACTIONS.USER_TOOGLE_AUDIO, ({ roomId, myId }) => {
    console.log(`User toggled their audio: peer ID ${myId} in room ${roomId}`);
    socket.broadcast.to(roomId).emit(ACTIONS.USER_TOOGLE_AUDIO, myId);
  });

  socket.on(ACTIONS.USER_TOOGLE_VIDEO, ({ roomId, myId }) => {
    console.log(`User toggled their video: peer ID ${myId} in room ${roomId}`);
    socket.broadcast.to(roomId).emit(ACTIONS.USER_TOOGLE_VIDEO, myId);
  });
});

// Start the server
httpServer.listen(port, () => console.log("Server is listening on port " + port));
