export interface OutboxEventDTO {
  type: string;
  payload: any;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
