var mongoose = require("mongoose");
var UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isEmailVerified: Boolean,
  verificationCode: String,
  pushToken: String
});
mongoose.model("User", UserSchema);

module.exports = mongoose.model("User");
