var mongoose = require("mongoose");
var TaskSchema = new mongoose.Schema({
  userId: String,
  text: String,
  time: String,
  creationDate: String
});
mongoose.model("Task", TaskSchema);

module.exports = mongoose.model("Task");
