// Importing required libraries
import { schedule } from "node-cron";

const task = schedule("*/9 * * * *", function () {
  console.log("running a task every 10 second");
});

export default task;
