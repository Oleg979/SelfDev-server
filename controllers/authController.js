//////////////////////////////////////////////////////////////////////////////////////

var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var config = require("../config/jwtConfig");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var VerifyToken = require("./tokenVerification");

var User = require("../schemas/User");

var sendMail = require("../mail/sendMail");

//////////////////////////////////////////////////////////////////////////////////////

router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (user)
      return res.status(401).send({ auth: false, text: "User already exists" });
    else {
      var hashedPassword = bcrypt.hashSync(req.body.password, 8);
      var random = Math.floor(Math.random() * 99999);
      User.create(
        {
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
          isEmailVerified: false,
          verificationCode: random
        },

        (err, user) => {
          if (err)
            return res.status(500).send({
              auth: false,
              text: "There was a problem registering the user."
            });

          sendMail(
            user.email,
            `<h1>Hello, ${
              req.body.name
            }!</h1> Thank you for registration! Your verification vode: <b>${random}</b>`,
            "SelfDev"
          );

          res.status(200).send({ auth: true, text: "Success!" });
        }
      );
    }
  });
});

//////////////////////////////////////////////////////////////////////////////////////

router.get("/me", VerifyToken, (req, res) => {
  User.findById(req.userId, { password: 0 }, (err, user) => {
    if (err)
      return res.status(500).send("There was a problem finding the user.");

    if (!user) return res.status(404).send("No user found.");

    res.status(200).send({ auth: true, user });
  });
});

//////////////////////////////////////////////////////////////////////////////////////

router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err)
      return res
        .status(500)
        .send({ auth: false, text: "Error on the server." });
    if (!user)
      return res.status(404).send({ auth: false, text: "No user found" });

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid)
      return res
        .status(401)
        .send({ auth: false, token: null, text: "Wrong password" });

    if (!user.isEmailVerified)
      return res
        .status(401)
        .send({ auth: false, token: null, text: "Email is not verified" });

    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: "1h"
    });

    res.status(200).send({ auth: true, token });
  });
});

//////////////////////////////////////////////////////////////////////////////////////

router.post("/verify", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err)
      return res
        .status(500)
        .send({ success: false, text: "Error on the server." });
    if (!user)
      return res.status(404).send({ success: false, text: "No user found." });
    if (user.verificationCode !== req.body.verificationCode)
      return res
        .status(401)
        .send({ success: false, text: "Wrong verification code" });
    User.findByIdAndUpdate(
      user._id,
      { $set: { isEmailVerified: true } },
      (err, user) => {
        res.status(200).send({ success: true, text: "Verified successfully" });
      }
    );
  });
});

//////////////////////////////////////////////////////////////////////////////////////

router.get("/logout", (req, res) => {
  res.status(200).send({ auth: false, token: null });
});

//////////////////////////////////////////////////////////////////////////////////////

module.exports = router;

//////////////////////////////////////////////////////////////////////////////////////
