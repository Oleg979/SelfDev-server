var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var axios = require("axios");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post("/send", (req, res) => {
  axios({
    method: "post",
    url: "https://api.push.expert/v1/pushSend/",
    headers: {
      "Content-Type": "application/json",
      "x-secret-key": "7K9R3wMQVQamt5e%U&&4uiy$1jR9V*pP5foDYr$i",
      "x-project-id": "9060d48b0ddbb5d3f61ac50ca8bb5b6d"
    },
    data: {
      title: req.body.title,
      message: req.body.message,
      url: req.body.url,
      target: {
        tokens: ["b3553990060f32d24c268380e0d78336a1140fdf"]
      }
    }
  }).then(data => res.send("ok"));
  console.log("push sended", req.body)
});

module.exports = router;
