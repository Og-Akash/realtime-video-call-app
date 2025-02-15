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

// This object stores users as: { socketId: username }
const userSocketMap = {};

// Helper function to get all clients in a room
const getAllClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || [])
  .filter(socketId => userSocketMap[socketId])
  .map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
};

io.on("connection", (socket) => {
  console.log("New client connected: ", socket.id);

  // When a user joins a room
  socket.on(ACTIONS.JOIN, ({ roomId, peerId, user }) => {
    console.log(
      `User joined: ${user} in room ${roomId} with peer ID ${peerId}`
    );

    // Map socket.id to the username
    userSocketMap[socket.id] = user;

    // Add the user to the room
    socket.join(roomId);

    // Get connected users in the room
    const connectedUsers = getAllClients(roomId);
    console.log(
      "All connected users in " + roomId + ": " + JSON.stringify(connectedUsers)
    );

    // Broadcast to everyone in the room that a new user has joined
    io.to(roomId).emit(ACTIONS.USER_JOINED, { user, peerId, connectedUsers });
  });

  socket.on(ACTIONS.USER_TOOGLE_AUDIO, ({ roomId, myId }) => {
    console.log(`User toggled their audio: peer ID ${myId} in room ${roomId}`);
    socket.broadcast.to(roomId).emit(ACTIONS.USER_TOOGLE_AUDIO, myId);
  });

  socket.on(ACTIONS.USER_TOOGLE_VIDEO, ({ roomId, myId }) => {
    console.log(`User toggled their video: peer ID ${myId} in room ${roomId}`);
    socket.broadcast.to(roomId).emit(ACTIONS.USER_TOOGLE_VIDEO, myId);
  });

  socket.on(ACTIONS.SEND_MESSAGE, ({ roomId, username, message }) => {
    console.log(`User ${username} sent a message: ${message} in room ${roomId}`);
    const msgData = {
      sender: username,
      message,
      time: new Date().toLocaleTimeString(),
    };
    io.to(roomId).emit(ACTIONS.RECEIVE_MESSAGE, msgData);
  });

  // socket.on(ACTIONS.USER_LEAVE, ({ email, roomId, myId }) => {
  //   console.log(`${email} left room ${roomId} with peer id ${myId}`);
  //   // Remove the user from our mapping
  //   delete userSocketMap[socket.id];
  //   const connectedUsers = getAllClients(roomId);
  //   console.log("Latest users: " + JSON.stringify(connectedUsers));

  //   socket.broadcast.to(roomId).emit(ACTIONS.USER_LEAVE, {
  //     email: email ?? "unknown",
  //     connectedUsers,
  //     userId: myId,
  //   });
  // });

  // When a socket disconnects (e.g. closing browser/tab)
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  
    // Retrieve username before removal
    const username = userSocketMap[socket.id];
  
    // Find all rooms the user was part of
    const rooms = Array.from(socket.rooms).filter((roomId) => roomId !== socket.id);
  
    // Remove user from map
    delete userSocketMap[socket.id];
  
    // Notify each room that the user has left
    rooms.forEach((roomId) => {
      const connectedUsers = getAllClients(roomId);
      console.log(`Updated user list for room ${roomId}:`, connectedUsers);
  
      socket.broadcast.to(roomId).emit(ACTIONS.USER_LEAVE, {
        email: username || "unknown",
        connectedUsers,
        userId: socket.id,
      });
    });
  });
  
});

// Start the server
httpServer.listen(port, () =>
  console.log("Server is listening on port " + port)
);
