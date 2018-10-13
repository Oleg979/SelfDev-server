var express = require("express");
var app = express();
var cors = require("cors");
app.use(cors());
require("./config/dbConfig");

var userController = require("./controllers/userController");
app.use("/users", userController);

var authController = require("./controllers/authController");
app.use("/auth", authController);

var pushController = require("./controllers/pushController");
app.use("/push", pushController);

var taskController = require("./controllers/taskController");
app.use("/tasks", taskController);

var port = process.env.PORT || 3000;
app.listen(port, () => console.log("Express server listening on port " + port));
