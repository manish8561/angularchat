#!/usr/bin/env node

/**
 * Module dependencies.
 */
const express = require("express");
const app = express();
var debug = require("debug")("angular2-nodejs:server");
var http = require("http");

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("new connection made.");

  socket.on("invite", function (data) {
    // new user invitation
    console.log(data, "invitation from user: ");
    socket.to("default").emit("new_user", data);
  });

  socket.on("join", function (data) {
    //joining
    socket.join(data.room);

    console.log(data.username + "joined the chat : " + data.room);

    socket.broadcast.to(data.room).emit("new user joined", {
      username: data.username,
      room: data.room,
      message: "has joined the chat.",
    });
  });
  socket.on("typing", function (data) {
    // console.log(data.username + 'typing in the chat : ' + data.room);

    socket.broadcast
      .to(data.room)
      .emit("new typing", { username: data.username, room: data.room });
  });
  socket.on("wait", function (data) {
    console.log("wait message to all");
    data.users.forEach((element) => {
      if (element.room !== data.room) {
        socket.to(element.room).emit("new message", {
          username: "admin",
          message: "Kindly wait for your turn you are in queue.",
        });
      }
    });
  });

  socket.on("leave", function (data) {
    console.log(data.username + "left the chat : " + data.room);

    socket.broadcast.to(data.room).emit("left room", {
      username: data.username,
      message: "has left the chat.",
      created_at: data.created_at,
      room: data.room,
    });

    socket.leave(data.room);
  });

  socket.on("message", function (data) {
    io.in(data.room).emit("new message", {
      username: data.username,
      message: data.message,
      created_at: data.created_at,
      room: data.room,
    });
  });
});

/**
 * Listen on provided port, on all network interfaces.
 */

app.get("/", function (req, res) {
  console.log("url is working");
  res.send("Hello world!");
});

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("Listening on " + bind);
  debug("Listening on " + bind);
}
