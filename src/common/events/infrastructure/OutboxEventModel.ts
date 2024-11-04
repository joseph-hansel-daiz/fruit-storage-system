import mongoose, { Document, Schema } from "mongoose";
import { OutboxEventStatus } from "../domain/enums/OutboxEventStatus.enum";

export interface IOutboxEventDocument extends Document {
  type: string;
  payload: any;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const OutboxEventSchema = new Schema({
  type: { type: String, required: true },
  payload: { type: Object, required: true },
  status: { type: String, default: OutboxEventStatus.PENDING },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const OutboxEventModel = mongoose.model<IOutboxEventDocument>(
  "OutboxEvent",
  OutboxEventSchema,
);
