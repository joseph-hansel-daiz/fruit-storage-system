import { EventEmitter } from "events";
import { OutboxEvent } from "../domain/OutboxEvent";
import { DomainEventEmitterService } from "./DomainEventEmitterService";
import { FRUIT_EVENTS } from "../../../modules/fruit/domain/constants/events.constant";

describe("DomainEventEmitterService", () => {
  let eventEmitterService: DomainEventEmitterService;
  const eventType = FRUIT_EVENTS.CREATE;
  const eventPayload = {
    name: "Apple",
    description: "A description of an apple",
    limitOfFruitToBeStored: 10,
    amountInStorage: 3,
  };

  beforeEach(() => {
    eventEmitterService = new DomainEventEmitterService();
  });

  describe("emit", () => {
    it("should emit an event with the correct type and payload", () => {
      const outboxEvent = OutboxEvent.create(eventType, eventPayload);
      const emitSpy = jest.spyOn(EventEmitter.prototype, "emit");

      eventEmitterService.emit(outboxEvent);

      expect(emitSpy).toHaveBeenCalledWith(
        outboxEvent.type,
        outboxEvent.payload,
      );

      emitSpy.mockRestore();
    });
  });

  describe("on", () => {
    it("should register a listener for a specific event type", () => {
      const outboxEvent = OutboxEvent.create(eventType, eventPayload);
      const listener = jest.fn();

      eventEmitterService.on(outboxEvent.type, listener);
      eventEmitterService.emit(outboxEvent);

      expect(listener).toHaveBeenCalledWith(outboxEvent.payload);
    });

    it("should call the listener with the correct payload when the event is emitted", () => {
      const outboxEvent = OutboxEvent.create(eventType, eventPayload);
      const listener = jest.fn();

      eventEmitterService.on(eventType, listener);
      eventEmitterService.emit(outboxEvent);

      expect(listener).toHaveBeenCalledWith(outboxEvent.payload);
    });
  });
});
