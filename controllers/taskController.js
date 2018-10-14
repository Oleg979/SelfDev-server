var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var Task = require("../schemas/Task");

var VerifyToken = require("./tokenVerification");
router.post("/add", VerifyToken, (req, res) => {
  Task.create(
    {
      userId: req.userId,
      text: req.body.text,
      time: req.body.time,
      creationDate: `${new Date().getDate()} ${new Date().getMonth()} ${new Date().getFullYear()}`
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

router.get("/get", VerifyToken, (req, res) => {
  Task.find(
    {
      userId: req.userId,
      creationDate: `${new Date().getDate()} ${new Date().getMonth()} ${new Date().getFullYear()}`
    },
    (err, tasks) => {
      if (err)
        return res.status(500).send({
          success: false,
          text: "There was a problem finding the tasks."
        });
      res.status(200).send({ success: true, tasks });
    }
  );
});

router.delete("/:id", (req, res) => {
  Task.findByIdAndRemove(req.params.id, (err, task) => {
    if (err)
      return res.status(500).send({
        success: false,
        text: "There was a problem deleting the task."
      });
    res
      .status(200)
      .send({ success: true, text: "Task: " + task._id + " was deleted." });
  });
});

module.exports = router;
