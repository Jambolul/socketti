const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("set username", (username) => {
    socket.username = username;
    console.log(`User ${username} connected`);
  });

  socket.on("join room", (room) => {
    socket.join(room);
    socket.room = room;
    console.log(`User ${socket.username} joined room: ${room}`);
  });

  socket.on("chat message", (msg) => {
    if (socket.room) {
      io.to(socket.room).emit("chat message", `${socket.username}: ${msg}`);
      console.log(`message from ${socket.username} in ${socket.room}: ${msg}`);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
