var mongoose = require("mongoose");
var StatSchema = new mongoose.Schema({
  userId: String,
  date: Number,
  fullDate: String,
  tasks: [
    {
      userId: String,
      text: String,
      time: String,
      creationDate: String,
      isChecked: Boolean
    }
  ],
  all: Number,
  done: Number
});
mongoose.model("Stat", StatSchema);

module.exports = mongoose.model("Stat");
