import { OutboxEventStatus } from "./enums/OutboxEventStatus.enum";

export class OutboxEvent {
  private _id: string;
  private _type: string;
  private _payload: any;
  private _status: OutboxEventStatus;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: string,
    type: string,
    paylaod: any,
    status: OutboxEventStatus,
    createAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._type = type;
    this._payload = paylaod;
    this._status = status;
    this._createdAt = createAt;
    this._updatedAt = updatedAt;
  }

  public get id() {
    return this._id;
  }

  public get type() {
    return this._type;
  }

  public get payload() {
    return this._payload;
  }

  public get status() {
    return this._status;
  }

  public get createdAt() {
    return this._createdAt;
  }

  public get updatedAt() {
    return this._updatedAt;
  }

  public setToSent(): void {
    this._status = OutboxEventStatus.SENT;
    this._updatedAt = new Date();
  }

  public setToFailed(): void {
    this._status = OutboxEventStatus.SENT;
    this._updatedAt = new Date();
  }

  public static create(
    type: string,
    paylaod: any,
    id: string = "",
    status: OutboxEventStatus = OutboxEventStatus.PENDING,
    createAt: Date = new Date(),
    updatedAtDate: Date = new Date(),
  ): OutboxEvent {
    return new OutboxEvent(id, type, paylaod, status, createAt, updatedAtDate);
  }
}
