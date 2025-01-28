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
  
    // Map socket.id to email
    socketIdToEmailMapping.set(socket.id, email);
  
    // Map email to peerId
    emailToSocketMapping.set(email, { peerId, socketId: socket.id });
  
    // Add the user to the room
    socket.join(roomId);
  
    // Notify the joining user about connected users
    const connectedUsers = Array.from(io.sockets.adapter.rooms.get(roomId) || [])
      .filter((id) => id !== socket.id) // Exclude the current socket
      .map((id) => {
        const userEmail = socketIdToEmailMapping.get(id);
        const userPeer = emailToSocketMapping.get(userEmail);
        return { email: userEmail, peerId: userPeer?.peerId };
      });
  
    socket.emit(ACTIONS.JOINED, { roomId, email, connectedUsers });
  
    // Notify other users about the new user
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

  socket.on(ACTIONS.USER_LEAVE, ({ roomId, myId }) => {
    console.log(`user leave from room ${roomId}`);
    socket.broadcast.to(roomId).emit(ACTIONS.USER_LEAVE, myId);
  })
});

// Start the server
httpServer.listen(port, () => console.log("Server is listening on port " + port));
