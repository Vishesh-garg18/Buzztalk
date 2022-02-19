module.exports.chatSockets = function (socketServer) {
  var io = require("socket.io")(socketServer)

  io.sockets.on("connection", (socket) => {
    console.log("new connection recieved !", socket.id);

    socket.on("disconnect", function () {
      console.log("Socket Disconnected !");
    });

    socket.on("join_room", function (data) {
      console.log("joining the requested room", data);

      socket.join(data.chat_room);

      io.in(data.chat_room).emit("user_joined", data);
    });

    socket.on("send_message", function (data) {
      io.in(data.chat_room).emit("receive_message", data);
    });
  });
};
