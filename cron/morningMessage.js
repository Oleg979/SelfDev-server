const CronJob = require("cron").CronJob;
var sendMail = require("../mail/sendMail");
var cronConfig = require("../config/cronConfig");

console.log("Morning message instantiation...");
const job = new CronJob(
  "00 38 11 * * *",
  function() {
    console.log("Morning message fired");
    sendMail("mr.persik666@mail.ru", `<h1>Hello</h1>`, "SelfDev");
  },
  null,
  false,
  cronConfig.timeZone
);
console.log("Morning message instantiation OK");
job.start();
