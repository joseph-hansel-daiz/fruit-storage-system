import { EventEmitter } from "events";
import { OutboxEvent } from "../domain/OutboxEvent";

export class DomainEventEmitterService {
  private emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
  }

  public emit(outboxEvent: OutboxEvent): boolean {
    return this.emitter.emit(outboxEvent.type, outboxEvent.payload);
  }

  public on(eventType: string, listener: (payload: any) => void): void {
    this.emitter.on(eventType, listener);
  }
}

const domainEventEmitterService = new DomainEventEmitterService();
export default domainEventEmitterService;
