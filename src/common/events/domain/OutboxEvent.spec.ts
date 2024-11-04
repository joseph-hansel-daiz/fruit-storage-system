import { FRUIT_STORAGE_EVENTS } from "../../../modules/fruitStorage/domain/constants/events.constant";
import { OutboxEvent } from "./OutboxEvent";
import { OutboxEventStatus } from "./enums/OutboxEventStatus.enum";

describe("OutboxEvent", () => {
  const eventId = "event-id";
  const eventType = FRUIT_STORAGE_EVENTS.CREATE;
  const eventPayload = {
    name: "Apple",
    description: "A description of an apple",
    limitOfFruitToBeStored: 10,
    amountInStorage: 3,
  };
  const initialStatus = OutboxEventStatus.PENDING;
  const initialDate = new Date("2023-01-01T00:00:00Z");

  describe("create", () => {
    it("should create an OutboxEvent instance with provided parameters", () => {
      const event = OutboxEvent.create(
        eventType,
        eventPayload,
        eventId,
        initialStatus,
        initialDate,
        initialDate,
      );

      expect(event.id).toBe(eventId);
      expect(event.type).toBe(eventType);
      expect(event.payload).toEqual(eventPayload);
      expect(event.status).toBe(initialStatus);
      expect(event.createdAt).toBe(initialDate);
      expect(event.updatedAt).toBe(initialDate);
    });

    it("should create an OutboxEvent with default values when optional parameters are omitted", () => {
      const event = OutboxEvent.create(eventType, eventPayload);

      expect(event.id).toBe("");
      expect(event.type).toBe(eventType);
      expect(event.payload).toEqual(eventPayload);
      expect(event.status).toBe(OutboxEventStatus.PENDING);
      expect(event.createdAt).toBeInstanceOf(Date);
      expect(event.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe("setToSent", () => {
    it("should update the status to SENT and set updatedAt to the current date", () => {
      const event = OutboxEvent.create(
        eventType,
        eventPayload,
        eventId,
        initialStatus,
        initialDate,
        initialDate,
      );
      const beforeUpdate = new Date();

      event.setToSent();

      expect(event.status).toBe(OutboxEventStatus.SENT);
      expect(event.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime(),
      );
    });
  });

  describe("setToFailed", () => {
    it("should update the status to FAILED and set updatedAt to the current date", () => {
      const event = OutboxEvent.create(
        eventType,
        eventPayload,
        eventId,
        initialStatus,
        initialDate,
        initialDate,
      );
      const beforeUpdate = new Date();

      event.setToFailed();

      expect(event.status).toBe(OutboxEventStatus.FAILED);
      expect(event.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime(),
      );
    });
  });

  describe("getters", () => {
    it("should return the correct values for each property", () => {
      const event = OutboxEvent.create(
        eventType,
        eventPayload,
        eventId,
        initialStatus,
        initialDate,
        initialDate,
      );

      expect(event.id).toBe(eventId);
      expect(event.type).toBe(eventType);
      expect(event.payload).toEqual(eventPayload);
      expect(event.status).toBe(initialStatus);
      expect(event.createdAt).toBe(initialDate);
      expect(event.updatedAt).toBe(initialDate);
    });
  });
});
