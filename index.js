const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();
// const nodemailer = require("nodemailer");


const app = express();
const port = process.env.NODE_PORT;
const cors = require("cors");
app.use(cors());
const http = require("http").createServer(app);
// const io = require("socket.io")(http);


// If you are using Socket.IO v3, you need to explicitly enable Cross-Origin Resource Sharing (CORS).
const io = require("socket.io")(http
  , {
  cors: {
    origin:process.env.NODE_IO_HOST ,
    methods: ["GET", "POST"]
  }
}
);


io.on("connection", (socket) => {
  console.log("a user is connected");

  socket.on("sendMessage", async (data) => {
    try {
      const { senderId, receiverId, message } = data;

      console.log("data", data);

      const newMessage = new Chat({ senderId, receiverId, message });
      await newMessage.save();

      //emit the message to the receiver
      io.to(receiverId).emit("receiveMessage", newMessage);
    } catch (error) {
      console.log("Error handling the messages");
    }
    socket.on("disconnet", () => {
      console.log("user disconnected");
    });
  });
});

http.listen(process.env.NODE_IO_PORT, () => {
  console.log("Socket.IO server running on port "+process.env.NODE_IO_PORT);
});

