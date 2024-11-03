import { OutboxEvent } from '../domain/OutboxEvent';
import { OutboxEventStatus } from '../domain/OutboxEventStatus.enum';
import outboxEventRepository from '../infrastructure/OutboxEventRepository';
import domainEventEmitterService, { DomainEventEmitterService } from './DomainEventEmitterService';

export class OutboxEventService {

  constructor(private domainEventEmitterService: DomainEventEmitterService) { }

  public async run() {
    const pendingEvents = await outboxEventRepository.findByStatus(OutboxEventStatus.PENDING);

    for (const event of pendingEvents) {
      try {
        const eventProcessed = this.domainEventEmitterService.emit(event)

        if (eventProcessed) {
          event.setToSent();
        } else {
          event.setToFailed();
        }

        await outboxEventRepository.update(event);

      } catch (error) {
        console.error(`Failed to process outbox event: ${error}`);
      }
    }
  }

  public async createEvent(type: string, payload: any) {
    const event = OutboxEvent.create(type, payload);
    outboxEventRepository.save(event);
  }
}

const outboxEventService = new OutboxEventService(domainEventEmitterService);
export default outboxEventService;
