const CronJob = require("cron").CronJob;
var sendMail = require("../mail/sendMail");
var cronConfig = require("../config/cronConfig");
var axios = require("axios");
var Task = require("../schemas/Task");
var User = require("../schemas/User");
var Stat = require("../schemas/Stat");

var processStat = function() {
    User.find({}, (err, users) => {
      if (err) return console.log("Evening message: Problem fetching users");
      users.forEach(user => { 
        Task.find(
          {
            userId: user._id,
            creationDate: `${new Date().getDate()} ${new Date().getMonth()} ${new Date().getFullYear()}`
          },
          (err, tasks) => {
            if (err)
              return sendMail(
                user.email, 
                `<h1>Hello, ${user.name}!</h1> This is your evening message`,
                "SelfDev"
              );
            sendMail(
              user.email,
              `<h1>Good night, ${
                user.name
              }!</h1> This is your evening message.<br/>
              <h2>Tasks you've done today:</h2> 
                ${tasks
                  .filter(task => task.isChecked)
                  .map((task, idx) => `<i>${idx + 1}.</i> <b>${task.text}</b>`)
                  .join("<br/>")}<br>
                  ${
                    tasks.filter(task => !task.isChecked).length != 0
                      ? `<h2>Tasks you've not done today:</h2> ${tasks
                          .filter(task => !task.isChecked)
                          .map(
                            (task, idx) =>
                              `<i>${idx + 1}.</i> <b>${task.text}</b>`
                          )
                          .join("<br/>")}<br>`
                      : `<h2>You've done all tasks today, very good!</h2>`
                  }
                    <h2>Now sleep well and good luck tomorrow :)</h2>`,
              "Good night from SelfDev"
            );
            Stat.create(
              {
                userId: user._id,
                date: new Date().getTime(),
                fullDate: `${new Date().getDate()} ${new Date().getMonth() +
                  1} ${new Date().getFullYear()}`,
                tasks: tasks,
                all: tasks.length,
                done: tasks.filter(task => task.isChecked).length
              },
              (err, stat) => {
                if (err) console.log("Error while adding stats");
                else console.log("Stat added");
              }
            );
          }
        );
      });
      console.log("Evening message fired");
    });
  };

console.log("Evening message instantiation...");
const job = new CronJob(
  "00 30 23 * * *",
  processStat
  null,
  false,
  cronConfig.timeZone
);
console.log("Evening message instantiation OK");
job.start();

module.exports = processStat;