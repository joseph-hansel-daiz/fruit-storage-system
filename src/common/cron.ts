import cron from "node-cron";
import outboxEventService from "./events/application/OutboxEventService";

cron.schedule("*/1 * * * *", async () => {
  await outboxEventService.run();
});
