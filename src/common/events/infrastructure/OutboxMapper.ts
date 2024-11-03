import { OutboxEvent } from "../domain/OutboxEvent";
import { OutboxEventDTO } from "../dtos/OutboxEventDTO";
import { IOutboxEventDocument, OutboxEventModel } from "./OutboxEventModel";


export default class OutboxMap {
    public static toDTO(outboxEvent: OutboxEvent): OutboxEventDTO {
        return {
            type: outboxEvent.type,
            payload: outboxEvent.payload,
            status: outboxEvent.status,
            createdAt: outboxEvent.createdAt,
            updatedAt: outboxEvent.updatedAt,
        }
    }

    public static toDomain(raw: any): OutboxEvent {
        return OutboxEvent.create(
            raw.type,
            raw.payload,
            raw._id,
            raw.status,
            raw.createdAt,
            raw.updatedAt
        );
    }

    public static ToMongoDocument(outboxEvent: OutboxEvent): IOutboxEventDocument {
        return new OutboxEventModel({
            type: outboxEvent.type,
            payload: outboxEvent.payload,
        });
    };
}