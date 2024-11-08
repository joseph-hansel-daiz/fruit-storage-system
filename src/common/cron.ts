import cron from "node-cron";
import outboxEventService from "./events/application/OutboxEventService";

cron.schedule("*/10 * * * * *", async () => {
  await outboxEventService.run();
});
