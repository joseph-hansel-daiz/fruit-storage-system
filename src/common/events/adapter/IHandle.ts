export interface IHandle {
  setupSubscriptions(): void;
  doAction(payload: any): void;
}
