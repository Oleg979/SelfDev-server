var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var axios = require("axios");
var pushConfig = require("../config/pushConfig");
var VerifyToken = require("./tokenVerification");
const CronJob = require("cron").CronJob;
var sendMail = require("../mail/sendMail");
var cronConfig = require("../config/cronConfig");
var User = require("../schemas/User");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post("/send", VerifyToken, (req, res) => {
  const job = new CronJob(
    new Date(+`${req.body.time}000`),
    function() {
      console.log("Email push message init...");
      User.findById(req.userId, (err, user) => {
        if (err)
          return console.log("Email push message: Problem fetching users");

        sendMail(
          user.email,
          `<h1>Hello, ${user.name}!</h1> It's time for <i>${
            req.body.text
          }</i>. Don't forget it.`,
          `You have a task: ${req.body.text}`
        );

        console.log("Email push message fired");
      });
    },
    null,
    false,
    cronConfig.timeZone
  );
  job.start();
  User.findById(req.userId, (err, user) => {
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
          tokens: [user.pushToken]
        }
      }
    }).then(data => res.send({ success: true, result: "ok" }));
    console.log(`push sended to ${user.pushToken}`, req.body);
  });
});

module.exports = router;
