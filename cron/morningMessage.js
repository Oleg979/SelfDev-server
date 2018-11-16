const CronJob = require("cron").CronJob;
var sendMail = require("../mail/sendMail");
var cronConfig = require("../config/cronConfig");
var axios = require("axios");
var User = require("../schemas/User");

console.log("Morning message instantiation...");
const job = new CronJob(
  "00 14 10 * * *",
  function() {
    User.find({}, (err, users) => {
      if (err)
        return console.log("Morning message: Problem with fetching users");
      users.forEach(user => {
        axios
          .get(
            "https://api.forismatic.com/api/1.0/?method=getQuote&key=457653&format=json&lang=en"
          )
          .then(data => {
          console.log(data)
            sendMail(
              user.email,
              `<h1>Goor morning, ${
                user.name
              }!</h1> This is your inspirational quote for this morning:
            <h2><i>${data.quoteText}</i> ©${data.quoteAuthor}</h2>
            <h2>Have a great day :)</h2>`,
              "Good morning from SelfDev"
            );
          });
      });
      console.log("Morning message fired");
    });
  },
  null,
  false,
  cronConfig.timeZone
);
console.log("Morning message instantiation OK");
job.start();
