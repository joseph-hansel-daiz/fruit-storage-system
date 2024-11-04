import { OutboxEvent } from "../domain/OutboxEvent";
import { OutboxEventStatus } from "../domain/enums/OutboxEventStatus.enum";

export interface IOutboxEventRepository {
  findById(id: string): Promise<OutboxEvent>;
  findByStatus(status: OutboxEventStatus): Promise<OutboxEvent[]>;
  findAll(): Promise<OutboxEvent[]>;
  save(outboxEvent: OutboxEvent): Promise<void>;
  update(outboxEvent: OutboxEvent): Promise<void>;
  deleteAll(): Promise<void>;
}
