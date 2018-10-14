const CronJob = require("cron").CronJob;
var sendMail = require("../mail/sendMail");
var cronConfig = require("../config/cronConfig");

console.log("Evening message instantiation...");
const job = new CronJob(
  "00 30 23 * * *",
  function() {
    console.log("Evening message fired");
    sendMail("mr.persik666@mail.ru", `<h1>Hello</h1>`, "SelfDev");
  },
  null,
  false,
  cronConfig.timeZone
);
console.log("Evening message instantiation OK");
job.start();
