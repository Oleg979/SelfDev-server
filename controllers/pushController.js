var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var axios = require("axios");
var pushConfig = require("../config/pushConfig");
var VerifyToken = require("./tokenVerification");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post("/send", VerifyToken, (req, res) => {
  axios({
    method: "post",
    url: "https://api.push.expert/v1/pushSend/",
    headers: {
      "Content-Type": "application/json",
      ...pushConfig
    },
    data: {
      title: req.body.text,
      message: req.body.text,
      url: "http://localhost:3001/",
      ttl: 30,
      sendTime: req.body.time,
      target: {
        tokens: ["b3553990060f32d24c268380e0d78336a1140fdf"]
      }
    }
  }).then(data => res.send({ success: true, result: "ok" }));
  console.log("push sended", req.body);
});

module.exports = router;
