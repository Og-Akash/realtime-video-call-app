import express from "express";
import { Server } from "socket.io";
import http from "http";
import { ACTIONS } from "./actions.js";
import cors from "cors";

//? initialize the servers
const app = express();
const port = 8000;

//? creating a http server
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: true,
});

//? Adding the middlwares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

//? getting the connection

const emailToSocketMapping = new Map();
const socketIdToEmailMapping = new Map();

io.on("connection", (socket) => {
  console.log("New client connected: ", socket.id);

  socket.on(ACTIONS.JOIN, ({ email, roomId }) => {
    console.log(`User Joined ${email} in room ${roomId}`);
    emailToSocketMapping.set(email, socket.id);
    socketIdToEmailMapping.set(socket.id, email);
    socket.join(roomId);
    socket.emit(ACTIONS.JOINED, { roomId });
    socket.broadcast.to(roomId).emit(ACTIONS.USER_JOINED, { email });
  });

  socket.on(ACTIONS.CALL_USER, (data) => {
    const { email, offer } = data;
    const fromEmail = socketIdToEmailMapping.get(socket.id);
    const socketId = emailToSocketMapping.get(email);
    socket.to(socketId).emit(ACTIONS.INCOMING_CALL, { from: fromEmail, offer });
  });
});

//? listening on port
httpServer.listen(port, () =>
  console.log("Server is listening on port " + port)
);
