"use strict";

// ================================================================
// get all the tools we need
// ================================================================
var express = require("express");
var routes = require("./routes/index.js");
var port = process.env.PORT || 3000;
var http = require("http");
var app = express();
var server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

io.sockets.on("connection", function (socket) {
  console.log("a user connected", socket.id);

  // "receive" event handler
  socket.on("user_coords", function (data) {
    console.log(data);
    io.sockets.emit("user_coords_broadcast", { ...data, id: socket.id });
  });
  socket.on("disconnect", function (data) {
    console.log("User Disconnected");
    io.emit("user_disconnected", { id: socket.id });
  });
});
// ================================================================
// setup our express application
// ================================================================
app.use("/public", express.static(process.cwd() + "/public"));
app.set("view engine", "ejs");

// ================================================================
// setup routes
// ================================================================
routes(app);

// ================================================================
// start our server
// ================================================================
server.listen(port, function () {
  console.log("Server listening on port " + port + "...");
});
