import { CronJob } from "cron";
import { databaseStaticsJob } from "./statics.js";

export function startCronJobs() {
  CronJob.start();
}
