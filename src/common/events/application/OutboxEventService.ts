import { OutboxEvent } from "../domain/OutboxEvent";
import { OutboxEventStatus } from "../domain/OutboxEventStatus.enum";
import outboxEventRepository from "../infrastructure/OutboxEventRepository";
import domainEventEmitterService, {
  DomainEventEmitterService,
} from "./DomainEventEmitterService";

export class OutboxEventService {
  constructor(private domainEventEmitterService: DomainEventEmitterService) {}

  public async run() {
    const pendingEvents = await outboxEventRepository.findByStatus(
      OutboxEventStatus.PENDING,
    );

    for (const event of pendingEvents) {
      const eventProcessed = this.domainEventEmitterService.emit(event);

      if (eventProcessed) {
        event.setToSent();
      } else {
        event.setToFailed();
      }

      await outboxEventRepository.update(event);
    }
  }

  public async createEvent(type: string, payload: any): Promise<void> {
    const event = OutboxEvent.create(type, payload);
    await outboxEventRepository.save(event);
  }

  public async deleteAllEvents(): Promise<void> {
    await outboxEventRepository.deleteAll();
  }

  public async findAllEvents(): Promise<OutboxEvent[]> {
    return outboxEventRepository.findAll();
  }
}

const outboxEventService = new OutboxEventService(domainEventEmitterService);
export default outboxEventService;
