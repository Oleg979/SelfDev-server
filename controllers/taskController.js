var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var Task = require("../schemas/Task");

var VerifyToken = require("./tokenVerification");

router.post("/", VerifyToken, (req, res) => {
  Task.create(
    {
      userId: req.userId,
      text: req.body.text,
      time: req.body.time
    },
    (err, task) => {
      if (err)
        return res.status(500).send({
          success: false,
          text: "There was a problem adding the information to the database."
        });
      res.status(200).send({ success: true, task: task });
    }
  );
});

router.get("/", VerifyToken, (req, res) => {
  Task.find({ name: req.userId }, (err, tasks) => {
    if (err)
      return res
        .status(500)
        .send({
          success: false,
          text: "There was a problem finding the tasks."
        });
    res.status(200).send({ success: true, tasks });
  });
});

module.exports = router;
