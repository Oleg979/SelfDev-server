var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var processStat = require("../cron/eveningMesage");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var Task = require("../schemas/Task");
var Stat = require("../schemas/Stat");

var VerifyToken = require("./tokenVerification");

router.get("/get", VerifyToken, (req, res) => {
  Stat.find(
    {
      userId: req.userId
    },
    (err, stats) => {
      if (err)
        return res.status(500).send({
          success: false,
          text: "There was a problem finding the stats."
        });
      res.status(200).send({ success: true, stats });
    }
  );
});

router.get("/trigger", (req, res) => {
  processStat();
  res.status(200).send({ success: true });
});

module.exports = router;
