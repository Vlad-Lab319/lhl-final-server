// const socketio = require("socket.io");
// const users = {};
// const SET_MESSAGES = "SET_MESSAGES";
// const SET_USERS = "SET_USERS";

// const getUserBySocket = (socketID) => {
//   return Object.values(users).find((user) => user.socketID === socketID);
// };

// const updateDispatch = (action, socket) => {
//   switch (action.type) {
//     case SET_USERS:
//       users[action.value.id] = { ...action.value, socketID: socket.id };
//       console.log(users);
//       return { type: action.type, value: users };
//     case SET_MESSAGES: {
//     }
//   }
// };

// // Web socket connection listener
// const listen = function (httpServer) {
//   const server = socketio(httpServer, {
//     cors: {
//       origin: "http://localhost:3000",
//     },
//   });

//   server.on("connection", (socket) => {
//     socket.on("update", (action) => {
//       server.emit("update", updateDispatch(action, socket));
//     });

// socket.on("disconnect", () => {
//   const user = getUserBySocket(socket.id);
//   if (user) {
//     delete users[user.id];
//     server.emit("update", { type: SET_USERS, value: users });
//   }
// });

//     socket.on("message", (message) => {
//       socket.emit("message", { type: SET_MESSAGES, value: message });
//     });

//     // Do something whenever a "chat" event is received
//     // socket.on("chat", (msg) => {
//     //   const from = getUserSocketId(socket.id);
//     //   console.log("chat: ", from, msg);

//     //   if (!from) {
//     //     return server.to(socket.id).emit("notify", `Not Registered`);
//     //   }

//     //   // Broadcast received message to all if no "to" received
//     //   if (!msg.to) {
//     //     server.emit("public", { ...msg, from });
//     //     server.to(socket.id).emit("notify", `Sent: ${msg.text}`);
//     //     return;
//     //   }

//     //   // Find socket id for this user, if exists
//     //   const destSocket = users[msg.to];
//     //   if (!destSocket) {
//     //     server.to(socket.id).emit("status", msg.to + " is not active");
//     //     return;
//     //   }

//     //   server.to(destSocket).emit("private", { ...msg, from });

//     //   // Send confirmation message back to the sender (by socket id)
//     //   server.to(socket.id).emit("notify", `Sent to ${msg.to}: ${msg.text}`);
//     // });
//   });
// };

// module.exports = { listen };
