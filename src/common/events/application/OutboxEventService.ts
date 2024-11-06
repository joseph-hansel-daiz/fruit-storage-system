import { OutboxEvent } from "../domain/OutboxEvent";
import { OutboxEventStatus } from "../domain/enums/OutboxEventStatus.enum";
import outboxEventRepository, {
  OutboxEventRepository,
} from "../infrastructure/OutboxEventRepository";
import domainEventEmitterService, {
  DomainEventEmitterService,
} from "./DomainEventEmitterService";

export class OutboxEventService {
  constructor(
    private domainEventEmitterService: DomainEventEmitterService,
    private outboxEventRepository: OutboxEventRepository,
  ) {}

  public async run() {
    const pendingEvents = await this.outboxEventRepository.findByStatus(
      OutboxEventStatus.PENDING,
    );

    for (const event of pendingEvents) {
      try {
        this.domainEventEmitterService.emit(event);
        event.setToSent();
      } catch (error) {
        event.setToFailed();
      }

      await this.outboxEventRepository.update(event);
    }
  }

  public async createEvent(type: string, payload: any): Promise<void> {
    const event = OutboxEvent.create(type, payload);
    await this.outboxEventRepository.save(event);
  }

  public async deleteAllEvents(): Promise<void> {
    await this.outboxEventRepository.deleteAll();
  }

  public async findAllEvents(): Promise<OutboxEvent[]> {
    return this.outboxEventRepository.findAll();
  }
}

const outboxEventService = new OutboxEventService(
  domainEventEmitterService,
  outboxEventRepository,
);
export default outboxEventService;
