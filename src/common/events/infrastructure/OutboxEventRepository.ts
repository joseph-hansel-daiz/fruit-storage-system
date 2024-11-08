import { ObjectId } from "mongodb";
import { IOutboxEventRepository } from "../adapter/IOutboxEventRepository";
import { OutboxEvent } from "../domain/OutboxEvent";
import { OutboxEventStatus } from "../domain/enums/OutboxEventStatus.enum";
import { OutboxEventModel } from "./OutboxEventModel";
import OutboxMap from "./OutboxMapper";

export class OutboxEventRepository implements IOutboxEventRepository {
  public async findById(id: string): Promise<OutboxEvent> {
    const document = await OutboxEventModel.find({
      _id: new ObjectId(id),
    }).lean();
    return OutboxMap.toDomain(document);
  }

  public async findByStatus(status: OutboxEventStatus): Promise<OutboxEvent[]> {
    const documents = await OutboxEventModel.find({ status: status }).lean();
    return documents.map((document) => {
      return OutboxMap.toDomain(document);
    });
  }

  public async findAll(): Promise<OutboxEvent[]> {
    const documents = await OutboxEventModel.find().lean();
    return documents.map((document) => {
      return OutboxMap.toDomain(document);
    });
  }

  public async save(outboxEvent: OutboxEvent): Promise<void> {
    const document = OutboxMap.ToMongoDocument(outboxEvent);
    await document.save();
  }

  public async update(outboxEvent: OutboxEvent): Promise<void> {
    await OutboxEventModel.findByIdAndUpdate(
      new ObjectId(outboxEvent.id),
      OutboxMap.toDTO(outboxEvent),
    );
  }

  public async deleteAll(): Promise<void> {
    await OutboxEventModel.deleteMany({});
  }
}

const outboxEventRepository = new OutboxEventRepository();
export default outboxEventRepository;
