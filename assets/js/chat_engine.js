class chatEngine {
  constructor(chatBoxId, userEmail) {
    this.chatBox = $(`#${chatBoxId}`);
    this.userEmail = userEmail;

    this.socket = io.connect("http://localhost:5000", {
      transport: ["websocket"],
    });

    if (this.userEmail) {
      this.connectionHandler();
    }
  }

  createMessagePill(data) {
    let senderMail = data.user_email;
    let msg = data.msg;
    console.log("create");
    let messageType = "other-message";
    if (senderMail === this.userEmail) {
      messageType = "self-message";
    }

    return $(`
        <li class="${messageType}">
        <span>${msg}</span>
            <div class="user-mail">${senderMail}</div>
        </li>
        `);
  }

  connectionHandler() {
    let self = this;

    this.socket.on("connect", function () {
      console.log("connection using sockets !");

      self.socket.emit("join_room", {
        user_email: self.userEmail,
        chat_room: "codial",
      });

      self.socket.on("user_joined", function (data) {
        console.log("user joined ", data);
      });

      $("#send-message").click(function () {
        let message = $("#chat-message-input").val();

        if (message != "") {
          self.socket.emit("send_message", {
            user_email: self.userEmail,
            chat_room: "codial",
            msg: message,
          });
          $("#chat-message-input").val("");
        }
      });

      self.socket.on("receive_message", function (data) {
        console.log("message received !", data.msg);
        let messagePill = self.createMessagePill(data);
        $(".chat-messages-list").append(messagePill);
      });
    });
  }
}
