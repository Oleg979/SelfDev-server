var express = require("express");
var app = express();
var cors = require("cors");
app.use(cors());
var axios = require("axios");

require("./config/dbConfig");
require("./cron/morningMessage");
require("./cron/eveningMesage");

// Prevent unidling
var axios = require("axios");
setInterval(() => {
  axios.get("https://self-develop.herokuapp.com");
}, 60000);

app.get("/", (req, res) => res.send("Working..."));

var userController = require("./controllers/userController");
app.use("/users", userController);

var authController = require("./controllers/authController");
app.use("/auth", authController);

var pushController = require("./controllers/pushController");
app.use("/push", pushController);

var taskController = require("./controllers/taskController");
app.use("/tasks", taskController);

var statController = require("./controllers/statController");
app.use("/stat", statController);

var port = process.env.PORT || 3000;
app.listen(port, () => console.log("Express server listening on port " + port));
