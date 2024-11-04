import dotenv from "dotenv";
import {
    connectToDatabase,
    disconnectFromDatabase,
} from "../../../config/database";
import { FRUIT_STORAGE_EVENTS } from "../../../modules/fruitStorage/domain/constants/events.constant";
import outboxEventRepository from "../infrastructure/OutboxEventRepository";
import domainEventEmitterService from "./DomainEventEmitterService";
import { OutboxEventService } from "./OutboxEventService";
import { OutboxEventStatus } from "../domain/enums/OutboxEventStatus.enum";

dotenv.config();

describe("OutboxEventService", () => {
  let outboxEventService: OutboxEventService;
  const eventType = FRUIT_STORAGE_EVENTS.CREATE;
  const eventPayload = {
    name: "Apple",
    description: "A description of an apple",
    limitOfFruitToBeStored: 10,
    amountInStorage: 3,
  };

  beforeAll(async () => {
    await connectToDatabase(process.env.MONGODB_URI_TEST || "");
    outboxEventService = new OutboxEventService(
      domainEventEmitterService,
      outboxEventRepository,
    );
  });

  afterAll(async () => {
    await disconnectFromDatabase();
  });

  beforeEach(async () => {
    await outboxEventRepository.deleteAll();
  });

  describe("run", () => {
    it("should process pending events and set them to SENT if emitted successfully", async () => {
        await outboxEventService.createEvent(eventType, eventPayload);
        await outboxEventService.run();

        const results = await outboxEventRepository.findAll()

        expect(results[0].status).toBe(OutboxEventStatus.SENT)
    });
  });

  describe("createEvent", () => {
    it("should create and save a new event", async () => {
      await outboxEventService.createEvent(eventType, eventPayload);

      const allEvents = await outboxEventRepository.findAll();
      expect(allEvents.length).toBe(1);
      expect(allEvents[0].type).toBe(eventType);
      expect(allEvents[0].payload).toStrictEqual(eventPayload);
    });
  });

  describe("deleteAllEvents", () => {
    it("should delete all events", async () => {
        await outboxEventService.createEvent(eventType, eventPayload);
        const previousLength = (await outboxEventRepository.findAll()).length;

        await outboxEventService.deleteAllEvents();

        const afterDeletionLength = (await outboxEventRepository.findAll()).length;
        expect(afterDeletionLength).not.toBe(previousLength);
    });
  });

  describe("findAllEvents", () => {
    it("should return all events", async () => {
        const previousLength = (await outboxEventRepository.findAll()).length;
        await outboxEventService.createEvent(eventType, eventPayload);
        await outboxEventService.createEvent(eventType, eventPayload);
        await outboxEventService.createEvent(eventType, eventPayload);

        const results = await outboxEventRepository.findAll()

        expect(results.length).not.toBe(previousLength);
        expect(results.length).toBe(3);
    });
  });
});
