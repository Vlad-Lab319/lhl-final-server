require("dotenv").config();
// const socketServer = require("./socketServer");
const express = require("express");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const http = require("http");
const cors = require("cors");
const { Server, Socket } = require("socket.io");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const PORT = process.env.SERVER_PORT || 8080;

const usersRoutes = require("./routes/users");
const roomsRoutes = require("./routes/rooms");
const channelsRoutes = require("./routes/channels");
const messagesRoutes = require("./routes/messages");

app.use("/api/users", usersRoutes);
app.use("/api/rooms", roomsRoutes);
app.use("/api/channels", channelsRoutes);
app.use("/api/messages", messagesRoutes);

// socket stuff below

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3002",
    methods: ["GET", "POST"],
  },
});

const users = {};
const SET_ACTIVE_USERS = "SET_ACTIVE_USERS";

const getUserBySocket = (socketID) => {
  return Object.values(users).find((user) => user.socketID === socketID);
};

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("updateActiveUsers", (action) => {
    users[action.value.id] = { ...action.value, socketID: socket.id };
    io.emit("updateActiveUsers", {
      type: SET_ACTIVE_USERS,
      value: users,
    });
  });

  socket.on("updateRooms", () => {
    io.emit("updateRooms");
  });

  socket.on("message", (messageData) => {
    socket.broadcast.emit("message", messageData);
  });

  socket.on("channel", (channelData) => {
    socket.broadcast.emit("channel", channelData);
  });

  socket.on("disconnect", () => {
    console.log(socket.id);
    const user = getUserBySocket(socket.id);
    if (user) {
      delete users[user.id];
      io.emit("updateActiveUsers", {
        type: SET_ACTIVE_USERS,
        value: users,
      });
      console.log("CONNECTED USERS: ", users);
    }
  });
});

server.listen(PORT, () => {
  console.log("SERVER RUNNING");
});
